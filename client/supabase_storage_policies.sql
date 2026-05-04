-- Allow anyone to upload files to the 'Product' bucket
CREATE POLICY "Allow public uploads" 
ON storage.objects FOR INSERT TO public 
WITH CHECK (bucket_id = 'Product');

-- Allow anyone to view files in the 'Product' bucket
CREATE POLICY "Allow public reading" 
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'Product');

-- Allow anyone to delete files in the 'Product' bucket (useful if you make mistakes or replace images)
CREATE POLICY "Allow public deletes" 
ON storage.objects FOR DELETE TO public 
USING (bucket_id = 'Product');
