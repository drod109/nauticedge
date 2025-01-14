@@ .. @@
   const [editForm, setEditForm] = useState({
+    email: '',
     phone: '',
     location: '',
     company_name: '',
@@ .. @@
         setUserData({
           ...user,
           ...metadata,
+          email: user.email
         });
         
         setEditForm({
+          email: user.email,
           phone: metadata?.phone || '',
           location: metadata?.location || '',
           company_name: metadata?.company_name || '',