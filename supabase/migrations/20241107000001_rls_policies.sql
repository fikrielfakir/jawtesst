-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Restaurants policies
CREATE POLICY "Restaurants are viewable by everyone" ON public.restaurants
  FOR SELECT USING (is_active = true);

CREATE POLICY "Restaurant owners can insert restaurants" ON public.restaurants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Restaurant owners can update their restaurants" ON public.restaurants
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Restaurant owners can delete their restaurants" ON public.restaurants
  FOR DELETE USING (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can view bookings for their restaurants" ON public.bookings
  FOR SELECT USING (auth.uid() IN (SELECT owner_id FROM public.restaurants WHERE id = restaurant_id));

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can update bookings for their restaurants" ON public.bookings
  FOR UPDATE USING (auth.uid() IN (SELECT owner_id FROM public.restaurants WHERE id = restaurant_id));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Stories policies
CREATE POLICY "Active stories are viewable by everyone" ON public.stories
  FOR SELECT USING (status = 'active' AND expires_at > NOW());

CREATE POLICY "Restaurant owners can create stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT owner_id FROM public.restaurants WHERE id = restaurant_id));

CREATE POLICY "Restaurant owners can delete their stories" ON public.stories
  FOR DELETE USING (auth.uid() IN (SELECT owner_id FROM public.restaurants WHERE id = restaurant_id));

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Menu Items policies
CREATE POLICY "Menu items are viewable by everyone" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can manage their menu items" ON public.menu_items
  FOR ALL USING (auth.uid() IN (SELECT owner_id FROM public.restaurants WHERE id = restaurant_id));
