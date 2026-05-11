import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, setAddresses } from '../redux/userSlice';
import axiosInstance from '../api/axiosInstance';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

const Login = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // Your API base URL from .env
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activated = searchParams.get('activated');
  const [email, setEmail] = useState(''); // Keep this if your backend supports login by email
  const [username, setUsername] = useState(''); // Essential for simplejwt's default TokenObtainPairView
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember me" checkbox
  const [error, setError] = useState<string | null>(null); // Explicitly type error state
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors
    
    // Basic frontend validation
    if (!username || !password) {
      setError('Nom d\'utilisateur et mot de passe requis.');
      return;
    }
    
    setLoading(true); // Show loading indicator
    
    try {
      // Send 'username' and 'password' (simplejwt's default fields for TokenObtainPairView)
      const response = await axiosInstance.post<{ access: string; refresh: string }>(`${apiBaseUrl}api/token/`, {
        // simplejwt's TokenObtainPairView expects 'username' by default.
        username: username, 
        password: password,
      });

      // 4. simplejwt returns 'access' and 'refresh' tokens
      const { access, refresh } = response.data;
    
      const userDetailsResponse = await axiosInstance.get(`${apiBaseUrl}api/user/me/`, {
        headers: {
          Authorization: `Bearer ${access}`, 
        },
      });
      const userData = userDetailsResponse.data

      // Dans ton handleLogin, après avoir récupéré userData
      const userAddresses = await axiosInstance.get(`${apiBaseUrl}api/user/get_address/`, {
        headers: {
          Authorization: `Bearer ${access}`, 
        },
      });
      dispatch(login({ 
        user: userData, 
        access: access, 
        refresh: refresh, 
        rememberMe: rememberMe 
      }));

      dispatch(setAddresses({ addresses: userAddresses.data })); 

      // 6. Show success message

      // 7. Redirect to the desired page after successful login
      navigate('/'); 

    } catch (error: any) {
      console.error('Login failed:', error);
      // More robust error handling for user feedback
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          // Common error message from simplejwt (e.g., "No active account found with the given credentials")
          setError(error.response.data.detail);
        } else if (error.response.data.username) { // Example for specific field errors
          setError(`Nom d'utilisateur: ${error.response.data.username[0]}`);
        } else if (error.response.data.password) {
          setError(`Mot de passe: ${error.response.data.password[0]}`);
        } else if (error.response.data.error) {
          // Your old custom error message structure
          setError(error.response.data.error);
        } else {
          setError('Erreur de connexion. Veuillez réessayer.');
        }
      } else {
        setError('Une erreur inattendue est survenue lors de la connexion.');
      }
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };
  useEffect(() => {
    // If the user is activated, you can show a message or redirect them
    if (activated) {
      Swal.fire({
        title: 'Compte activé',
        text: 'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      navigate('/login');
    }
  }, [activated, navigate]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary px-6 py-12 md:px-12 lg:px-16 flex items-end">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(0,0,0,0.2),_transparent_30%)]" />
          <div className="relative max-w-xl text-white">
            <p className="text-xs uppercase tracking-[0.22em] font-semibold text-white/75">Welcome back</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Sign in to your Shopsy account
            </h1>
            <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-lg">
              Access your profile, wishlist, cart and orders from one secure place. Keep track of your shopping experience in a cleaner, faster way.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-xl">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                <p className="text-sm font-semibold">Order tracking</p>
                <p className="text-xs text-white/75 mt-1">Follow purchases and payment status.</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                <p className="text-sm font-semibold">Wishlist sync</p>
                <p className="text-xs text-white/75 mt-1">Save items and find them anytime.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 md:px-12 lg:px-16">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)] p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 font-semibold">Authentication</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Connexion</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Use your account credentials to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300 px-4 py-3 text-sm">
                  {error}
                </p>
              )}
              {loading && (
                <p className="rounded-2xl border border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300 px-4 py-3 text-sm">
                  Veuillez patienter...
                </p>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Email</span>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 text-gray-900 dark:text-gray-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Nom d'utilisateur</span>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 text-gray-900 dark:text-gray-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Mot de passe</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 pr-12 text-gray-900 dark:text-gray-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Se souvenir de moi
                </label>
                <Link to={'/reset-password'} className='text-sm font-medium text-primary hover:text-secondary transition-colors'>
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                className="mt-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3.5 text-lg font-semibold text-white shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Connexion
              </button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Pas encore de compte ?{' '}
                <a href="/register" className='font-semibold text-primary hover:text-secondary transition-colors'>
                  S'inscrire
                </a>
              </p>
              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                <span>Ou connectez-vous avec</span>
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className='flex gap-3 justify-center'>
                <button className='rounded-2xl px-4 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors'>Facebook</button>
                <button className='rounded-2xl px-4 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors'>Google</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;