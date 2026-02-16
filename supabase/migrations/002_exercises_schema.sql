-- Create exercises table
CREATE TABLE public.exercises (
  id TEXT PRIMARY KEY, -- e.g., 'ankle_wall_mobility'
  name TEXT NOT NULL,
  name_es TEXT NOT NULL, -- nombre en español
  category TEXT NOT NULL, -- 'mobility' | 'activation' | 'strength' | 'capacity'
  target TEXT NOT NULL, -- 'ankle' | 'hip' | 'glute' | 'core' | 'posterior_chain' | 'balance'

  -- Content
  description TEXT NOT NULL,
  instructions JSONB NOT NULL, -- array de pasos ["Paso 1...", "Paso 2..."]
  common_mistakes JSONB, -- array de errores comunes
  equipment JSONB, -- array de equipo necesario

  -- Media
  video_url TEXT, -- YouTube embed URL (por ahora)
  thumbnail_url TEXT,

  -- Metadata
  duration_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL, -- 'beginner' | 'intermediate' | 'advanced'
  sets INTEGER DEFAULT 3,
  reps INTEGER, -- null si es tiempo-based
  hold_seconds INTEGER, -- null si es reps-based

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_exercises_category ON public.exercises(category);
CREATE INDEX idx_exercises_target ON public.exercises(target);
CREATE INDEX idx_exercises_difficulty ON public.exercises(difficulty);

-- Enable RLS (datos públicos, read-only para usuarios)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view exercises
CREATE POLICY "Anyone can view exercises"
  ON public.exercises FOR SELECT
  USING (true);

-- Add constraint for category values
ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_category_check
  CHECK (category IN ('mobility', 'activation', 'strength', 'capacity'));

-- Add constraint for difficulty values
ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_difficulty_check
  CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));

-- Add constraint for target values
ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_target_check
  CHECK (target IN ('ankle', 'hip', 'glute', 'core', 'posterior_chain', 'balance', 'full_body'));
