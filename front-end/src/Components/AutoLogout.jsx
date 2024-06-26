import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContent';
const AutoLogout = () => {
    const navigate = useNavigate();
    const { setUserID } = useUser(); // Use the setUserID function from your context

    useEffect(() => {
        axios.post('https://chop-recipes-back-end.vercel.app/logout', {}, { withCredentials: true })
            .then(result => {
                setUserID(null);
                localStorage.removeItem('userID');
            })
            .catch(err => console.log(err));
    }, [setUserID, navigate]);

    // This component does not render anything
    return null;
};

export default AutoLogout;