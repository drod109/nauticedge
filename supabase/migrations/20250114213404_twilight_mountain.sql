-- Create function to generate secure random string
CREATE OR REPLACE FUNCTION generate_secure_string(length integer)
RETURNS text AS $$
DECLARE
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..length LOOP
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to create API key
CREATE OR REPLACE FUNCTION create_api_key(
  p_name text,
  p_user_id uuid DEFAULT auth.uid()
) RETURNS jsonb AS $$
DECLARE
  v_api_key text;
  v_key_hash text;
BEGIN
  -- Check if user is authenticated
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Generate API key
  v_api_key := generate_secure_string(32);
  v_key_hash := encode(digest(v_api_key, 'sha256'), 'hex');

  -- Insert new API key
  INSERT INTO api_keys (
    user_id,
    name,
    key_hash
  ) VALUES (
    p_user_id,
    p_name,
    v_key_hash
  );

  -- Return the API key (will only be shown once)
  RETURN jsonb_build_object(
    'key', v_api_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;