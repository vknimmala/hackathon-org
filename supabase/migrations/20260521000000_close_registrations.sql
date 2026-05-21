-- Stop public registration submissions (participant and volunteer).
DROP POLICY IF EXISTS "Anyone can submit a registration" ON public.registrations;
