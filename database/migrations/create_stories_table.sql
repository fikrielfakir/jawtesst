-- Create chef_stories table for Instagram-style stories
-- Stories expire after 24 hours and can contain images or videos

CREATE TABLE IF NOT EXISTS public.chef_stories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  venue_id uuid NOT NULL,
  media_url text NOT NULL,
  media_type varchar(10) NOT NULL CHECK (media_type IN ('image', 'video')),
  duration integer NOT NULL DEFAULT 5,
  views integer NOT NULL DEFAULT 0,
  status varchar(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired')),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chef_stories_pkey PRIMARY KEY (id),
  CONSTRAINT chef_stories_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_chef_stories_venue_id ON public.chef_stories(venue_id);
CREATE INDEX IF NOT EXISTS idx_chef_stories_status ON public.chef_stories(status);
CREATE INDEX IF NOT EXISTS idx_chef_stories_expires_at ON public.chef_stories(expires_at);

-- Create story_views table to track which users have viewed which stories
CREATE TABLE IF NOT EXISTS public.story_views (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  story_id uuid NOT NULL,
  user_id uuid NOT NULL,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT story_views_pkey PRIMARY KEY (id),
  CONSTRAINT story_views_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.chef_stories(id) ON DELETE CASCADE,
  CONSTRAINT story_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT story_views_unique UNIQUE (story_id, user_id)
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON public.story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_user_id ON public.story_views(user_id);

-- Function to automatically expire stories after 24 hours
CREATE OR REPLACE FUNCTION expire_old_stories()
RETURNS void AS $$
BEGIN
  UPDATE public.chef_stories
  SET status = 'expired'
  WHERE expires_at < now() AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Add some sample stories for testing
INSERT INTO public.chef_stories (venue_id, media_url, media_type, duration, status, expires_at)
SELECT 
  id as venue_id,
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1080&h=1920&fit=crop' as media_url,
  'image' as media_type,
  5 as duration,
  'active' as status,
  (now() + interval '24 hours') as expires_at
FROM public.venues
LIMIT 5;
