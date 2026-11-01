REVOKE EXECUTE ON FUNCTION public.create_user_profile() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_active_access() FROM anon;