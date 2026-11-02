CREATE OR REPLACE FUNCTION public.create_user_profile()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$ BEGIN INSERT INTO public.profiles(id,display_name) VALUES(NEW.id,left(coalesce(NEW.raw_user_meta_data->>'display_name',''),100)) ON CONFLICT (id) DO NOTHING; RETURN NEW; END $function$;