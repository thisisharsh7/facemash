const express = require('express');
const cors = require('cors');
const profiles = require('./profiles.json');

const app = express();
app.use(cors());
app.use(express.json());

const userProfile = {
  age: 21,
  gender: 'female',
  city: 'Mumbai',
  university: 'IIT Bombay',
  degree: 'B.Tech',
  year: 2026,
  interests: ['music', 'photography', 'travel'],
  behavioral_data: {
    previous_ratings: [],
    response_patterns: {
      liked_interests: {},
      liked_universities: {},
      liked_age_range: [18, 30],
    },
  },
  last_decision: 'neutral',
};

const shownProfiles = new Set();

const weights = {
  w1: 0.3,
  w2: 0.2,
  w3: 0.15,
  w4: 0.2,
  w5: 0.25,
  w6: 0.1,
};

const nearbyUniversities = {
  'IIT Bombay': ['IIT Delhi'],
  'IIT Delhi': ['IIT Bombay'],
  'NIT Trichy': ['IIT Madras'],
};

const calculateMatchScore = (profile) => {
  const user = userProfile;
  const b = user.behavioral_data.response_patterns;

  const university_match =
    user.university === profile.university
      ? 1
      : nearbyUniversities[user.university]?.includes(profile.university)
        ? 0.5
        : 0;

  const degree_match = user.degree === profile.degree ? 1 : 0;
  const city_match = user.city === profile.city ? 1 : 0;
  const age_similarity = 1 - Math.abs(user.age - profile.age) / 5;

  const shared_interests = user.interests.filter((i) =>
    profile.interests.includes(i)
  );
  const interest_overlap =
    shared_interests.length /
    Math.max(user.interests.length, profile.interests.length);

  let behavioral_affinity = 0;
  for (const interest of profile.interests) {
    behavioral_affinity += (b.liked_interests[interest] || 0) * 0.1;
  }
  behavioral_affinity += (b.liked_universities[profile.university] || 0) * 0.2;

  const [minAge, maxAge] = b.liked_age_range;
  if (profile.age >= minAge && profile.age <= maxAge) {
    behavioral_affinity += 0.3;
  }

  return (
    weights.w1 * university_match +
    weights.w2 * degree_match +
    weights.w3 * city_match +
    weights.w4 * age_similarity +
    weights.w5 * interest_overlap +
    weights.w6 * behavioral_affinity
  );
};

const needsDiversity = () => {
  const last5 = userProfile.behavioral_data.previous_ratings.slice(-5);
  const fullProfiles = last5
    .map((id) => profiles.find((p) => p.profile_id === id))
    .filter(Boolean);

  const allSameUni =
    fullProfiles.length === 5 &&
    fullProfiles.every((p) => p.university === fullProfiles[0].university);

  return allSameUni;
};

app.get('/api/next-profile', (req, res) => {
  const unshown = profiles.filter((p) => !shownProfiles.has(p.profile_id));

  if (unshown.length === 0) {
    return res.status(404).json({ error: 'No more profiles available' });
  }

  const scored = unshown.map((p) => ({
    profile: p,
    score: calculateMatchScore(p),
  }));

  let branchCandidates;

  if (userProfile.last_decision === 'like') {
    branchCandidates = scored.sort((a, b) => b.score - a.score).slice(0, 10);
  } else if (userProfile.last_decision === 'dislike') {
    branchCandidates = scored.sort((a, b) => a.score - b.score).slice(0, 10);
  } else {
    branchCandidates = scored.sort((a, b) => b.score - a.score).slice(0, 1);
  }

  let next = branchCandidates.find((c) => !shownProfiles.has(c.profile.profile_id));

  if (next && needsDiversity()) {
    const diverse = scored.filter(
      (c) => c.profile.university !== next.profile.university
    );
    if (diverse.length > 0) {
      next = diverse.sort((a, b) => b.score - a.score)[0];
    }
  }

  if (!next) {
    return res.status(404).json({ error: 'No eligible profile found' });
  }

  shownProfiles.add(next.profile.profile_id);
  res.json(next.profile);
});

app.post('/api/rate-profile', (req, res) => {
  const { profile_id, reaction } = req.body;
  const profile = profiles.find((p) => p.profile_id === profile_id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const b = userProfile.behavioral_data.response_patterns;
  userProfile.behavioral_data.previous_ratings.push(profile_id);

  if (reaction === 'like') {
    for (const interest of profile.interests) {
      b.liked_interests[interest] = (b.liked_interests[interest] || 0) + 1;
    }
    b.liked_universities[profile.university] =
      (b.liked_universities[profile.university] || 0) + 1;

    const [minAge, maxAge] = b.liked_age_range;
    b.liked_age_range = [
      Math.min(minAge, profile.age),
      Math.max(maxAge, profile.age),
    ];

    userProfile.last_decision = 'like';
  } else {
    userProfile.last_decision = 'dislike';
  }

  res.json({ success: true });
});

app.post('/api/reset-search', (req, res) => {
  shownProfiles.clear();
  userProfile.behavioral_data.previous_ratings = [];
  userProfile.behavioral_data.response_patterns = {
    liked_interests: {},
    liked_universities: {},
    liked_age_range: [18, 30],
  };
  userProfile.last_decision = 'neutral';

  res.status(200).json({ success: true });
});


app.listen(3001, () => {
  console.log('Server running on port 3001');
});
