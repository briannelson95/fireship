import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../lib/context'
import debounce from 'lodash.debounce'

export default function EnterPage(props) {
    const { user, username } = useContext(UserContext)

    // 1. user signed out <SignInButton />
    // 2. user signed in but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return(
        <main>
            {user ? 
                !username ? <UsernameForm /> : <SignOutButton /> 
                : 
                <SignInButton />
            }
        </main>
    )
}

// google sign in
function SignInButton() {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider)
    }

    return (
        <button className='btn-google' onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    );
}

// sign out button
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

// username form
function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onChange = (e) => {
        const val = e.target.value.toLowercase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue])

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`username/${username}`);
                const { exists } = await ref.get();
                console.log('Firestore read executed!');
                setIsValid(!exists);
                setLoading(false)
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>

                    <input name="username" placeholder='username' value={formValue} onChange={onChange} />
                    <button type='submit' className='btn-green' disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}