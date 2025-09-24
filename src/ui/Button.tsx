 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/project/src/components/ui/Button.tsx b/project/src/components/ui/Button.tsx
index bd2e7d61ac62a218840ecf078034764df66e5720..f1d35200e8b4f0a8bc77e3253dc0b7dc399aa269 100644
--- a/project/src/components/ui/Button.tsx
+++ b/project/src/components/ui/Button.tsx
@@ -25,42 +25,59 @@ export const Button: React.FC<ButtonProps> = ({
   
   const variantClasses = {
     primary: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
     secondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500',
     outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-cyan-500',
     danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
     success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
   };
   
   const sizeClasses = {
     sm: 'text-xs px-2.5 py-1.5',
     md: 'text-sm px-4 py-2',
     lg: 'text-base px-6 py-3',
   };
   
   const classes = [
     baseClasses,
     variantClasses[variant],
     sizeClasses[size],
     fullWidth ? 'w-full' : '',
     disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '',
     className
   ].join(' ');
   
   return (
-    <button 
-      className={classes} 
-      disabled={disabled || isLoading}
-      {...props}
-    >
-      {isLoading && (
-        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
-          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
-          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
-        </svg>
-      )}
+      <button
+        className={classes}
+        disabled={disabled || isLoading}
+        {...props}
+      >
+        {isLoading && (
+          <svg
+            className="animate-spin -ml-1 mr-2 h-4 w-4"
+            xmlns="http://www.w3.org/2000/svg"
+            fill="none"
+            viewBox="0 0 24 24"
+            aria-hidden="true"
+          >
+            <circle
+              className="opacity-25"
+              cx="12"
+              cy="12"
+              r="10"
+              stroke="currentColor"
+              strokeWidth="4"
+            />
+            <path
+              className="opacity-75"
+              fill="currentColor"
+              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
+            />
+          </svg>
+        )}
       {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
       {children}
       {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
     </button>
   );
 };
 
EOF
)