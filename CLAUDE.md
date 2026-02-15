# Pre-Running System - Web Application

## Project Overview

**Pre-Running System** is a web application that helps sedentary people prepare their bodies for running through a personalized 12-week program, preventing the 70% injury rate that affects beginner runners.

### The Problem
- 10+ million people run in Spain, but 70% get injured in their first year
- Most runners are sedentary (8+ hours/day sitting) with structural dysfunctions
- They start running without preparation, leading to predictable injuries in 3-6 weeks

### The Solution
A 12-week program divided in 3 phases:
1. **Assessment (Weeks 1-2)**: 7 specific tests to identify individual limitations
2. **Foundations (Weeks 3-8/10)**: Personalized plan to correct dysfunctions (mobility, activation, strength, capacity)
3. **Transition (Weeks 9-12)**: Gradual introduction to running

### Value Proposition
- **Traditional path**: 0 prep → 70% injury in 6 weeks → frustration, abandonment
- **Pre-Running System**: 12 weeks prep → 5-10% injury → run 10-20 years without injury

---

## Technical Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: React Context API + hooks
- **Charts**: Recharts
- **Video Player**: React Player
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Backend
- **BaaS**: Supabase
  - PostgreSQL database
  - Authentication (email/password, Google)
  - Storage (videos, images)
  - Real-time subscriptions (future)
  - Edge Functions (serverless logic if needed)

### Hosting & Deployment
- **Frontend**: Vercel
- **Backend**: Supabase (hosted)
- **CDN**: Vercel/Cloudflare for static assets

### Payments
- **Stripe** for subscription management
- Webhooks for automatic fulfillment

### Analytics
- Google Analytics 4
- Mixpanel for product events
- Supabase built-in analytics

### Email
- Resend.com for transactional emails
- Automated sequences (onboarding, check-ins, reminders)

---

## Project Architecture

### Folder Structure
```
pre-running-system/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI (Button, Input, Card, etc.)
│   │   ├── assessment/     # Assessment-specific components
│   │   ├── dashboard/      # Dashboard components
│   │   └── exercises/      # Exercise library components
│   ├── pages/              # Route pages
│   │   ├── Landing.jsx
│   │   ├── Auth/
│   │   ├── Assessment/
│   │   ├── Results.jsx
│   │   ├── Dashboard/
│   │   └── Pricing.jsx
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── AssessmentContext.jsx
│   │   └── PlanContext.jsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useAssessment.js
│   │   └── useProgress.js
│   ├── lib/                # Utilities and configs
│   │   ├── supabase.js     # Supabase client
│   │   ├── stripe.js       # Stripe integration
│   │   ├── personalization.js  # Plan generation algorithm
│   │   └── constants.js    # Constants and configs
│   ├── styles/             # Global styles
│   ├── App.jsx
│   └── main.jsx
├── public/                 # Static assets
├── supabase/              # Supabase migrations and functions
│   ├── migrations/
│   └── functions/
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Database Schema (Supabase)

### Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `assessments`
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week INTEGER DEFAULT 0, -- 0 = baseline, 1-12 = weekly re-tests
  
  -- Test 1: Ankle ROM
  ankle_rom_right DECIMAL, -- cm (8-20 range)
  ankle_rom_left DECIMAL,
  
  -- Test 2: Hip Extension
  hip_extension_right DECIMAL, -- degrees (-15 to +20)
  hip_extension_left DECIMAL,
  
  -- Test 3: Glute Activation
  glute_activation_right TEXT, -- 'glute_first' | 'simultaneous' | 'hamstrings_first'
  glute_activation_left TEXT,
  
  -- Test 4: Core
  core_plank_time INTEGER, -- seconds
  
  -- Test 5: Posterior Chain
  posterior_chain_flexibility TEXT, -- 'toes' | 'shins' | 'knees' | 'thighs'
  
  -- Test 6: Aerobic Capacity
  aerobic_capacity TEXT, -- '45min_easy' | '30-45min_mild' | 'under_30min_hard'
  
  -- Test 7: Balance
  balance_right INTEGER, -- seconds
  balance_left INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_assessments_user_week ON assessments(user_id, week);
```

#### `plans`
```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id),
  
  -- Generated plan data
  priorities JSONB, -- Array of priority objects
  estimated_weeks INTEGER, -- 6, 8, or 10
  phase_1_duration INTEGER DEFAULT 2,
  phase_2_duration INTEGER, -- 6-10 weeks
  phase_3_duration INTEGER DEFAULT 4,
  total_weeks INTEGER,
  
  -- Plan metadata
  status TEXT DEFAULT 'active', -- 'active' | 'completed' | 'abandoned'
  current_week INTEGER DEFAULT 1,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `exercises`
```sql
CREATE TABLE exercises (
  id TEXT PRIMARY KEY, -- e.g., 'ankle_wall_mobility'
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'mobility' | 'activation' | 'strength' | 'capacity'
  target TEXT, -- 'ankle' | 'hip' | 'glute' | 'core' | etc.
  
  -- Content
  video_url TEXT,
  thumbnail_url TEXT,
  instructions JSONB, -- Array of instruction steps
  common_mistakes JSONB, -- Array of common mistakes
  equipment JSONB, -- Array of equipment needed
  
  -- Metadata
  duration_minutes INTEGER,
  difficulty TEXT, -- 'beginner' | 'intermediate' | 'advanced'
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `weekly_plans`
```sql
CREATE TABLE weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  phase TEXT NOT NULL, -- 'assessment' | 'foundations' | 'transition'
  
  sessions JSONB, -- Array of session objects (day, type, exercises)
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(plan_id, week_number)
);
```

#### `user_sessions`
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weekly_plan_id UUID REFERENCES weekly_plans(id),
  
  week INTEGER NOT NULL,
  day TEXT NOT NULL, -- 'monday' | 'tuesday' | etc.
  session_type TEXT, -- 'mobility_activation' | 'strength' | 'running' | etc.
  
  -- Planned vs Actual
  planned_exercises JSONB,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  
  -- User notes
  notes TEXT,
  difficulty_rating INTEGER, -- 1-5
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_progress`
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session tracking
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  completion_rate DECIMAL GENERATED ALWAYS AS (
    CASE WHEN total_sessions > 0 
    THEN (completed_sessions::DECIMAL / total_sessions * 100) 
    ELSE 0 END
  ) STORED,
  
  -- Time tracking
  total_minutes INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_session_date DATE,
  
  -- Achievements
  achievements JSONB DEFAULT '[]'::jsonb,
  total_points INTEGER DEFAULT 0,
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  tier TEXT NOT NULL, -- 'free' | 'pro' | 'pro_plus'
  status TEXT DEFAULT 'active', -- 'active' | 'canceled' | 'expired'
  
  -- Stripe integration
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Billing
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Core Features - Phase 1 (MVP)

### 1. Authentication
- Email/password signup and login (Supabase Auth)
- Google OAuth (optional, better conversion)
- Password reset flow
- Email verification

### 2. Assessment Flow
Seven interactive tests with instructions, videos, and validation:

1. **Ankle ROM (Dorsiflexion)**
   - Video: Wall test demonstration
   - Input: Numeric (cm) for each foot
   - Validation: 5-20cm range
   - Interpretation: <10cm = HIGH priority, 10-12cm = MEDIUM, 12-15cm = OPTIMAL

2. **Hip Extension**
   - Video: Thomas test demonstration
   - Input: Visual selector (elevated/horizontal/below)
   - Conversion: elevated = -10°, horizontal = 0°, below = +15°
   - Interpretation: Elevated >10° = HIGH priority

3. **Glute Activation**
   - Video: Bridge test with palpation
   - Input: Selector (glute first/simultaneous/hamstrings first)
   - Interpretation: Hamstrings first = HIGH priority

4. **Core Stability**
   - Video: Proper plank form
   - Input: Numeric (seconds)
   - Validation: 5-300 seconds
   - Interpretation: <30s = HIGH, 30-60s = MEDIUM, >60s = GOOD

5. **Posterior Chain Flexibility**
   - Video: Toe touch test
   - Input: Selector (toes/shins/knees/thighs)
   - Interpretation: Knees or above = MEDIUM priority

6. **Aerobic Capacity**
   - Video: 45min walk test explanation
   - Input: Selector (easy/mild fatigue/hard)
   - Interpretation: Hard = HIGH priority

7. **Balance/Stability**
   - Video: Single leg stand demonstration
   - Input: Numeric (seconds per leg)
   - Interpretation: <60s = MEDIUM priority

### 3. Personalization Algorithm

```javascript
function generatePersonalizedPlan(assessment) {
  const priorities = [];
  
  // Ankle ROM evaluation
  const ankleRomMin = Math.min(assessment.ankle_rom_right, assessment.ankle_rom_left);
  if (ankleRomMin < 10) {
    priorities.push({
      area: 'Ankle ROM',
      severity: 'HIGH',
      current: ankleRomMin,
      target: 13,
      weeklyMinutes: 70, // 10min daily
      exercises: ['ankle_wall_mobility', 'calf_stretch', 'dorsiflexion_active']
    });
  } else if (ankleRomMin < 12) {
    priorities.push({
      area: 'Ankle ROM',
      severity: 'MEDIUM',
      current: ankleRomMin,
      target: 13,
      weeklyMinutes: 35,
      exercises: ['ankle_wall_mobility', 'calf_stretch']
    });
  }
  
  // Glute activation evaluation
  const gluteIssue = assessment.glute_activation_right === 'hamstrings_first' ||
                     assessment.glute_activation_left === 'hamstrings_first';
  if (gluteIssue) {
    priorities.push({
      area: 'Glute Activation',
      severity: 'HIGH',
      current: 'hamstrings_first',
      target: 'glute_first',
      weeklyMinutes: 105, // 15min daily
      exercises: ['clams', 'bridge', 'single_leg_bridge', 'fire_hydrants']
    });
  }
  
  // Core evaluation
  if (assessment.core_plank_time < 30) {
    priorities.push({
      area: 'Core Stability',
      severity: 'HIGH',
      current: assessment.core_plank_time,
      target: 60,
      weeklyMinutes: 60, // 3x 20min/week
      exercises: ['plank_progression', 'dead_bug', 'bird_dog']
    });
  }
  
  // Hip extension evaluation
  const hipExtMin = Math.min(assessment.hip_extension_right, assessment.hip_extension_left);
  if (hipExtMin < -5) {
    priorities.push({
      area: 'Hip Extension',
      severity: 'HIGH',
      current: hipExtMin,
      target: 5,
      weeklyMinutes: 70,
      exercises: ['hip_flexor_stretch', 'couch_stretch', '90_90_hip_mobility']
    });
  }
  
  // Calculate program duration based on HIGH priorities
  const highPriorities = priorities.filter(p => p.severity === 'HIGH').length;
  const estimatedWeeks = highPriorities >= 3 ? 10 : highPriorities >= 2 ? 8 : 6;
  
  return {
    priorities: priorities.sort((a, b) => 
      a.severity === 'HIGH' && b.severity !== 'HIGH' ? -1 : 1
    ),
    estimatedWeeks,
    phase1Duration: 2,
    phase2Duration: estimatedWeeks,
    phase3Duration: 4,
    totalWeeks: 2 + estimatedWeeks + 4
  };
}
```

### 4. Results Dashboard
- Visual display of user's limitations (radar chart)
- Priority areas (HIGH/MEDIUM/LOW) with color coding
- Estimated program duration
- Visual timeline (12-week progress bar)
- CTA: "Start Foundations"

---

## User Experience Flow

### First-Time User Journey
1. **Landing Page** → Learn about problem and solution
2. **Sign Up** → Create account (email or Google)
3. **Onboarding** → Brief explanation of assessment
4. **Assessment** → Complete 7 tests (~15-20 min)
5. **Results** → See personalized plan and priorities
6. **Dashboard** → View weekly plan and start first session

### Returning User Journey
1. **Login** → Authenticate
2. **Dashboard** → See current week, today's session, progress
3. **Session** → Complete exercises, mark as done
4. **Progress** → Weekly re-test, view improvement graphs

---

## Key Design Principles

### 1. Mobile-First
- Primary usage will be on mobile during workouts
- Responsive design with mobile as priority
- Large touch targets, easy navigation
- Offline-first for exercise videos (future)

### 2. Clarity Over Complexity
- Each screen has ONE clear purpose
- Minimal cognitive load
- Progressive disclosure (show what's needed when needed)
- Clear CTAs

### 3. Trust & Credibility
- Professional design
- Data-driven messaging (70% injury rate, etc.)
- Educational content explaining "why"
- Progress transparency (you see your numbers improve)

### 4. Motivation & Engagement
- Visual progress indicators
- Micro-achievements (week completed, ROM improved, etc.)
- Encouraging copy, not clinical
- Celebrate milestones

---

## Development Phases

### Phase 1: MVP Core (Weeks 1-3)
**Goal**: User can complete assessment and see personalized plan

**Deliverables**:
- [ ] Authentication (email/password)
- [ ] Assessment flow (7 tests with validation)
- [ ] Personalization algorithm
- [ ] Results screen with priorities
- [ ] Basic dashboard skeleton
- [ ] Supabase setup and schema

**Tech Debt Acceptable**:
- Videos can be YouTube embeds (not hosted)
- Basic styling (functional, not beautiful)
- No payment yet (all free)

---

### Phase 2: Content & Execution (Weeks 4-6)
**Goal**: User can execute weekly plan with exercises

**Deliverables**:
- [ ] Exercise library (30 exercises with videos)
- [ ] Weekly plan generation
- [ ] Session view (exercises of the day)
- [ ] Mark session complete
- [ ] Weekly re-test flow
- [ ] Progress graphs (ROM over time)

**Tech Debt Acceptable**:
- Manual exercise entry (not dynamic)
- Simple progress charts

---

### Phase 3: Engagement (Weeks 7-8)
**Goal**: User stays motivated through 12 weeks

**Deliverables**:
- [ ] Achievements system
- [ ] Streak tracking
- [ ] Email notifications (session reminders, re-test)
- [ ] Educational content integration
- [ ] Adjustment flow (if pain reported)

---

### Phase 4: Monetization (Weeks 9-10)
**Goal**: Validate business model

**Deliverables**:
- [ ] Pricing tiers (Free/Pro/Pro+)
- [ ] Stripe integration
- [ ] Paywall (4 weeks free, then upgrade)
- [ ] Landing page
- [ ] Analytics tracking
- [ ] Initial marketing content

---

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (when Phase 4)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Analytics (when Phase 4)
VITE_GA_MEASUREMENT_ID=your_ga_id
VITE_MIXPANEL_TOKEN=your_mixpanel_token

# Email (when Phase 3)
RESEND_API_KEY=your_resend_key
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint
npm run lint

# Format with Prettier
npm run format
```

---

## Coding Standards

### React Component Pattern
```jsx
// Use functional components with hooks
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};
```

### Styling (TailwindCSS)
```jsx
// Use Tailwind utility classes
<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
  Click Me
</button>

// For complex/repeated patterns, create components
<Button variant="primary" size="lg">Click Me</Button>
```

### State Management
```jsx
// Local state: useState
const [count, setCount] = useState(0);

// Shared state: Context
const { user, login, logout } = useAuth();

// Server state: React Query (future optimization)
```

### Error Handling
```javascript
try {
  const { data, error } = await supabase
    .from('assessments')
    .insert([assessment]);
    
  if (error) throw error;
  
  return data;
} catch (error) {
  console.error('Error saving assessment:', error);
  // Show user-friendly error message
  toast.error('Failed to save assessment. Please try again.');
}
```

---

## Testing Strategy

### Unit Tests (Future)
- Personalization algorithm
- Utility functions
- Custom hooks

### Integration Tests (Future)
- Authentication flow
- Assessment completion
- Plan generation

### E2E Tests (Future)
- Complete user journey
- Payment flow
- Critical paths

**Note**: For MVP, manual testing is acceptable. Add automated tests as product matures.

---

## Deployment

### Vercel Deployment
1. Connect GitHub repo to Vercel
2. Configure environment variables
3. Auto-deploy on push to `main`
4. Preview deployments on PRs

### Supabase Setup
1. Create project on supabase.com
2. Run migrations from `supabase/migrations`
3. Configure Auth providers
4. Set up Storage buckets for videos
5. Copy connection details to `.env`

---

## Success Metrics (Analytics Events)

### Acquisition
- Landing page visits
- Sign-up initiated
- Sign-up completed
- Sign-up method (email/Google)

### Activation
- Assessment started
- Assessment completed (7/7 tests)
- Results viewed
- First session started

### Engagement
- Sessions completed (daily)
- Weekly re-test completed
- Streak milestone (3, 7, 14, 30 days)
- Achievement unlocked

### Retention
- DAU/MAU ratio
- Week-over-week completion rate
- Abandonment point (which week)

### Revenue (Phase 4)
- Paywall shown
- Upgrade initiated
- Upgrade completed
- Tier selected (Pro/Pro+)
- MRR, LTV

---

## Known Limitations & Future Improvements

### MVP Limitations
- Videos are external (YouTube embeds) - not ideal for offline
- No AI/ML for form checking - relies on user honesty
- No community features - solo experience
- Limited exercise library - 30 exercises vs potential 100+

### Future Enhancements
- Native mobile apps (React Native)
- AI form checking (pose estimation)
- Community/social features
- More sports (Pre-Padel, Pre-CrossFit)
- Coach matching platform
- Wearable integration (Apple Watch, Garmin)
- Offline-first PWA

---

## Support & Documentation

### For Developers
- This `claude.md` file (you're reading it!)
- Inline code comments for complex logic
- Component-level README for complex features

### For Users
- In-app tooltips and help text
- FAQ page
- Email support (support@prerunningsystem.com)
- Knowledge base (future)

---

## Contact & Team

**Product Owner**: [Your Name]
**Technical Lead**: Building with Claude Code
**Design**: [To be defined]

**Repository**: [GitHub URL when created]
**Production URL**: [Domain when deployed]

---

## License

Proprietary - All rights reserved

---

**Last Updated**: February 2026
**Version**: 1.0 - MVP Phase
**Status**: 🚀 Ready to build

---

## Quick Start for Claude Code

When starting a new session:

1. **Context**: We're building Pre-Running System, a web app to prepare sedentary people for running
2. **Current Phase**: Phase 1 - MVP Core (Assessment + Personalization)
3. **Stack**: React + Vite + TailwindCSS + Supabase
4. **Next Task**: [Will be defined in conversation]

**Key Files to Reference**:
- `/src/lib/personalization.js` - Plan generation algorithm
- `/src/components/assessment/` - Assessment test components
- `/src/contexts/AuthContext.jsx` - Authentication state
- `/supabase/migrations/` - Database schema

**Remember**:
- Mobile-first design
- Keep it simple (MVP mindset)
- User can complete assessment and see plan (Phase 1 goal)
- We iterate fast, perfect later
