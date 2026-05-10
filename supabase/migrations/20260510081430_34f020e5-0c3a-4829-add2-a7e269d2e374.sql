UPDATE public.brandings
SET 
  logo_pdf_url = COALESCE(logo_pdf_url, '/images/Audi.svg'),
  marketing_image_url = COALESCE(marketing_image_url, '/images/audi_gwplus.jpg'),
  email_logo_url = COALESCE(email_logo_url, 'https://www.tiemeyer.de/media/uploads/2025/06/Audi.svg');