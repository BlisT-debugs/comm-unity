
CREATE OR REPLACE FUNCTION public.increment(row_id uuid)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count int;
BEGIN
  SELECT upvote_count INTO current_count FROM public.issues WHERE id = row_id;
  RETURN current_count + 1;
END;
$$;
