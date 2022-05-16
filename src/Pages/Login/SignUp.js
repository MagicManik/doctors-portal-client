import React from 'react';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle, useUpdateProfile } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { useForm } from "react-hook-form";
import Loading from '../Shared/Loading';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {

    // Using react firebase hook [google signin]
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    // Using react form hook
    const { register, formState: { errors }, handleSubmit } = useForm();
    // Using react firebase hook [create user]
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    // Using react firebase hook [update user]
    const [updateProfile, updating, UpdateError] = useUpdateProfile(auth);


    const navigate = useNavigate();

    let signInError;

    if (loading || gLoading) {
        return <Loading></Loading>
    }

    if (error || gError || UpdateError) {
        signInError = <p className='text-red-500'><small>{error?.message || gError?.message} {UpdateError?.message}</small></p>
    }

    if (user || gUser || updating) {
        console.log(user || gUser)
    }


    // submit login form event handler
    const onSubmit = async data => {
        // console.log(data);
        // create user
        await createUserWithEmailAndPassword(data.email, data.password);
        // update profile
        await updateProfile({ displayName: data.name });
        console.log('Updated profile');
        // when user singUp navigate appointment page
        navigate('/appointment');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-3xl font-bold text-center text-primary">Sign Up</h2>


                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* ___ name field ___ */}
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Name</span>

                            </label>
                            <input

                                type="text"
                                placeholder="Your name"
                                class="input input-bordered w-full max-w-xs"

                                // name validation
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: 'Name is required'
                                    }
                                })}
                            />

                            {/* show name validation error on ui */}
                            <label class="label">

                                {errors.name?.type === 'required' && <span className="label-text-alt text-red-500 ">{errors.name.message}</span>}

                            </label>
                        </div>




                        {/* ___ email field ___ */}
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Email</span>

                            </label>
                            <input

                                type="email"
                                placeholder="Your email"
                                class="input input-bordered w-full max-w-xs"

                                // email validation
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Email is required'
                                    },
                                    pattern: {
                                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                        message: 'Provide a valied email'
                                    }
                                })}
                            />

                            {/* show email validation on ui */}
                            <label class="label">

                                {errors.email?.type === 'required' && <span className="label-text-alt text-red-500 ">{errors.email.message}</span>}

                                {errors.email?.type === 'pattern' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                            </label>
                        </div>


                        {/* ___ password field ___ */}
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Password</span>
                            </label>
                            <input

                                type="password"
                                placeholder="Your password"
                                class="input input-bordered w-full max-w-xs"

                                // password validation
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: 'Password is required'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'Must be 6 characters or longer'
                                    }
                                })}
                            />

                            {/* show password validation on ui */}
                            <label class="label">

                                {errors.password?.type === 'required' && <span className="label-text-alt text-red-500 ">{errors.password.message}</span>}

                                {errors.password?.type === 'minLength' && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                            </label>
                        </div>

                        {/* display signInError */}
                        {signInError}

                        {/* submit button */}
                        <input className='btn w-full max-w-xs' type="submit" value='Sign Up' />
                    </form>

                    {/* toggle signup page */}
                    <p><small>Already have an account? <Link className='text-primary' to='/login'>Please Login</Link></small></p>

                    <div className="divider">OR</div>
                    <button onClick={() => signInWithGoogle()} className="btn btn-outline">Continue With Google</button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;