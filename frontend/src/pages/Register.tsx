import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { User } from '../types/User';
import { is } from 'date-fns/locale';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation states
    const [passwordsMismatch, setPasswordsMismatch] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [weakPassword, setWeakPassword] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);
    const [policyAccepted, setPolicyAccepted] = useState(false);
    const [newsLetterSubscription, setNewsLetterSubscription] = useState(false);

    // Validations dynamiques pour Email
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Valide l'email seulement s'il n'est pas vide
        setInvalidEmail(email.length > 0 && !emailRegex.test(email));
        // Vérifie la disponibilité de l'email via API (débounced)
        const handler = setTimeout(() => {
            if (email.length > 0 && emailRegex.test(email)) { // Seulement si l'email semble valide
                axiosInstance.post('api/user/email/', { email })
                    .then(response => setEmailTaken((response.data as { exists: boolean }).exists))
                    .catch(error => console.error('Error checking email:', error));
            } else {
                setEmailTaken(false); // Réinitialise si l'email est vide ou invalide
            }
        }, 500); // Débounce pour éviter trop de requêtes
        return () => clearTimeout(handler);
    }, [email]);

    // Validations dynamiques pour Username
    useEffect(() => {
        // Vérifie la disponibilité du nom d'utilisateur via API (débounced)
        const handler = setTimeout(() => {
            if (username.length > 0) {
                axiosInstance.post('api/user/username/', { username })
                    .then(response => setUsernameTaken((response.data as { exists: boolean }).exists))
                    .catch(error => console.error('Error checking username:', error));
            } else {
                setUsernameTaken(false); // Réinitialise si le nom d'utilisateur est vide
            }
        }, 500); // Débounce
        return () => clearTimeout(handler);
    }, [username]);

    // Validations dynamiques pour Password
    useEffect(() => {
        // Le mot de passe est considéré faible s'il est non vide mais ne respecte pas les critères
        setWeakPassword(
            password.length > 0 &&
            (password.length < 6 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*]/.test(password))
        );
    }, [password]);

    // Validations dynamiques pour Confirm Password
    useEffect(() => {
        // Les mots de passe ne correspondent que si les deux champs sont non vides et différents
        setPasswordsMismatch(
            confirmPassword.length > 0 && password.length > 0 && password !== confirmPassword
        );
    }, [password, confirmPassword]);

    // --- Fin des Validations dynamiques ---


    // Define the expected response structure from the register API
    interface RegisterResponse {
        access: string;
        refresh: string;
        user: User;
    }

    interface RegisterFormEvent extends React.FormEvent<HTMLFormElement> {}

    const handleSubmit = async (e: RegisterFormEvent): Promise<void> => {
        e.preventDefault();

        // Une dernière re-validation complète avant soumission
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const currentInvalidEmail = !emailRegex.test(email);
        const currentWeakPassword = password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password);
        const currentPasswordsMismatch = password !== confirmPassword;

        // Mise à jour explicite des états de validation pour le cas où l'utilisateur n'aurait pas déclenché tous les onChanges/useEffects
        setInvalidEmail(currentInvalidEmail);
        setWeakPassword(currentWeakPassword);
        setPasswordsMismatch(currentPasswordsMismatch);

        // Empêche la soumission si l'une des validations échoue ou si les champs sont déjà pris/politique non acceptée
        if (currentInvalidEmail || currentWeakPassword || currentPasswordsMismatch || usernameTaken || emailTaken || !policyAccepted || email.length === 0 || username.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur d\'inscription',
                text: 'Veuillez corriger toutes les erreurs et remplir tous les champs obligatoires avant de soumettre.',
            });
            return;
        }

        try {
            const response = await axiosInstance.post<RegisterResponse>('api/register/', {
                email,
                username,
                password,
                newsletter_subscription: newsLetterSubscription,
                is_active: false, // L'utilisateur doit confirmer son compte
            });
            Swal.fire({
                icon: 'success',
                title: 'Inscription réussie !',
                text: 'Vous avez été inscrit! Consultez votre boite mail pour activer le compte.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            navigate('/login')

        } catch (error: any) {
            console.error('Erreur d\'inscription:', error);
            let errorMessage = 'Une erreur inattendue est survenue lors de l\'inscription.';

            if (error.response) {
                if (error.response.data) {
                    // Tente d'extraire un message d'erreur spécifique du backend
                    if (error.response.data.email) {
                        errorMessage = `Email: ${Array.isArray(error.response.data.email) ? error.response.data.email.join(', ') : error.response.data.email}`;
                    } else if (error.response.data.username) {
                        errorMessage = `Nom d'utilisateur: ${Array.isArray(error.response.data.username) ? error.response.data.username.join(', ') : error.response.data.username}`;
                    } else if (error.response.data.password) {
                        errorMessage = `Mot de passe: ${Array.isArray(error.response.data.password) ? error.response.data.password.join(', ') : error.response.data.password}`;
                    } else if (error.response.data.detail) {
                        errorMessage = error.response.data.detail;
                    } else {
                        errorMessage = JSON.stringify(error.response.data);
                    }
                } else {
                    errorMessage = `Erreur du serveur: ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'Pas de réponse du serveur. Veuillez vérifier votre connexion internet.';
            } else {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Échec de l\'inscription !',
                text: errorMessage,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary px-6 py-12 md:px-12 lg:px-16 flex items-end">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(0,0,0,0.2),_transparent_30%)]" />
                    <div className="relative max-w-xl text-white">
                        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-white/75">Join Shopsy</p>
                        <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            Create your account in a few steps
                        </h1>
                        <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-lg">
                            Track your orders, save your wishlist, and enjoy a smoother shopping experience from your personal dashboard.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-xl">
                            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                                <p className="text-sm font-semibold">Secure account</p>
                                <p className="text-xs text-white/75 mt-1">Email verification and password checks included.</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                                <p className="text-sm font-semibold">Fast checkout</p>
                                <p className="text-xs text-white/75 mt-1">Save time on future purchases and orders.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center px-6 py-10 md:px-12 lg:px-16">
                    <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_20px_55px_-34px_rgba(0,0,0,0.45)] p-6 md:p-8">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 font-semibold">Registration</p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight">Register</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Fill in your details to create your account.
                            </p>
                        </div>

                        <form className='grid gap-4' onSubmit={handleSubmit}>
                            <div className='grid gap-4 sm:grid-cols-2'>
                                <div className='flex flex-col gap-2'>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 text-gray-900 dark:text-gray-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
                                        required
                                    />
                                    {invalidEmail && <span className='text-red-500 text-xs'>Invalid email address</span>}
                                    {emailTaken && !invalidEmail && <span className='text-red-500 text-xs'>Email already taken</span>}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 text-gray-900 dark:text-gray-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
                                        required
                                    />
                                    {usernameTaken && <span className='text-red-500 text-xs'>Username already taken</span>}
                                </div>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-2'>
                                <div className='relative flex flex-col gap-2'>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 pr-12 text-gray-900 dark:text-gray-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-4 top-[42px] text-gray-500 hover:text-primary transition-colors'
                                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                    {weakPassword && (
                                        <span className='text-red-500 text-xs'>
                                            Password too weak (min 6 chars, 1 uppercase, 1 number, 1 special char)
                                        </span>
                                    )}
                                </div>

                                <div className='relative flex flex-col gap-2'>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Confirm password</label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className='w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 pr-12 text-gray-900 dark:text-gray-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute right-4 top-[42px] text-gray-500 hover:text-primary transition-colors'
                                        aria-label={showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                    {passwordsMismatch && <span className='text-red-500 text-xs'>Passwords do not match</span>}
                                </div>
                            </div>

                            <div className='grid gap-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4'>
                                <label className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300'>
                                    <input type="checkbox" id="terms" className='text-primary w-4 h-4 rounded border-gray-300 focus:ring-primary' required checked={policyAccepted} onChange={() => setPolicyAccepted(!policyAccepted)} />
                                    <span>I agree to the terms and conditions</span>
                                </label>
                                <label className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300'>
                                    <input type="checkbox" id="newsletter" className='text-primary w-4 h-4 rounded border-gray-300 focus:ring-primary' checked={newsLetterSubscription} onChange={() => setNewsLetterSubscription(!newsLetterSubscription)} />
                                    <span>Subscribe to our newsletter</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className='mt-1 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3.5 text-lg font-semibold text-white shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={
                                    invalidEmail || weakPassword || passwordsMismatch ||
                                    usernameTaken || emailTaken || !policyAccepted ||
                                    email.length === 0 || username.length === 0 ||
                                    password.length === 0 || confirmPassword.length === 0
                                }
                            >
                                Register
                            </button>
                        </form>

                        <div className="mt-6 space-y-4 text-center">
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Already have an account? <a href="/login" className='font-semibold text-primary hover:text-secondary transition-colors'>Login</a>
                            </p>
                            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                                <span>Or register with</span>
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
}

export default Register;