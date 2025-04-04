
CREATE OR REPLACE FUNCTION increment_community_member_count(
  community_id_param uuid,
  increment_amount integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE communities
  SET member_count = member_count + increment_amount
  WHERE id = community_id_param;
END;
$$;
