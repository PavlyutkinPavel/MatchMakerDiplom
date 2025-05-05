import './App.css';
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import SignUp from "./components/sign-up/SignUp";
import VerificationCodeInput from "./components/sign-up/VerificationCodeInput";
import SignInSide from "./components/sign-in-side/SignInSide";
import Pricing from "./components/pricing/Pricing";
import ScrollToTop from "./components/UI/ScrollToTop";
import TeamManagementCrudAdvanced from "./components/crud_all/components/TeamManagementCrudAdvanced";
import DashboardLayoutAccountSidebar from "./components/crud_all/components/DashboardLayoutBasic";
import PrivateRoute from "./PrivateRoute";
import useApplicationStore from "./components/utils/store/store";
import MatchMaker from "./components/blog/MatchMaker";
import ResetPassword from "./components/sign-in-side/components/ResetPassword";
import VerificationCodeInputRq from "./components/sign-up/VerificationCodeInputRq";
import MatchMakerFAQ from "./components/faq/MatchMakerFAQ";
import MatchMakerReviews from "./components/reviews/MatchMakerReviews";
import SportProfile from "./components/profile/SportProfile";
import ContactsFollowing from "./components/profile/ContactsFollowing";
import EditProfile from "./components/profile/EditProfile";
import TournamentEventsManagementCrudAdvanced
    from "./components/crud_all/components/TournamentEventsManagementCrudAdvanced";
import {useEffect} from "react";


function App() {
    const { isAuthenticated} = useApplicationStore();

    useEffect(() => {
        handleCheck()
    }, []);

    let handleCheck = () => {
        if(!isAuthenticated){
            const excludedPaths = ['/signin', '/signup', '/verification', '/verification_rq', '/reset_password', '/faq', '/reviews', '/'];

            if (!excludedPaths.includes(window.location.pathname)) {
                window.location.href = '/signin';
            }
        }
    }
    return (
        <Router>
            <div>
                <ScrollToTop/>
                <Routes>
                    <Route path="/" element={<MatchMaker/>}/>
                    <Route path="/pricing" element={<Pricing/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/signin" element={<SignInSide/>}/>
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/tournament" element={<TournamentEventsManagementCrudAdvanced/>}/>
                    </Route>
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/team" element={<TeamManagementCrudAdvanced />} />
                    </Route>
                    <Route path="/verification" element={<VerificationCodeInput/>}/>
                    <Route path="/verification_rq" element={<VerificationCodeInputRq/>}/>
                    <Route path="/reset_password" element={<ResetPassword/>}/>
                    <Route path="/faq" element={<MatchMakerFAQ/>}/>
                    <Route path="/reviews" element={<MatchMakerReviews/>}/>
                    <Route path="/profile" element={<SportProfile/>}/>
                    <Route path="/edit_profile" element={<EditProfile/>}/>
                    <Route path="/contacts" element={<ContactsFollowing/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
