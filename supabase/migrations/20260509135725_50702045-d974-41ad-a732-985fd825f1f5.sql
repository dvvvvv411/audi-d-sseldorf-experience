UPDATE public.user_roles
SET role = 'caller'::app_role
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'caller@caller.de');