import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SignUp from "./components/sign-up/SignUp";
import VerificationCodeInput from "./components/sign-up/VerificationCodeInput";
import SignInSide from "./components/sign-in-side/SignInSide";
import Pricing from "./components/mainpage/Pricing";
import ScrollToTop from "./components/UI/ScrollToTop";
import PrivateRoute from "./PrivateRoute";
import useApplicationStore from 'store/useApplicationStore';
import MatchMaker from "./components/blog/MatchMaker";
import ResetPassword from "./components/sign-in-side/components/ResetPassword";
import VerificationCodeInputRq from "./components/sign-up/VerificationCodeInputRq";
import MatchMakerFAQ from "./components/mainpage/MatchMakerFAQ";
import MatchMakerReviews from "./components/mainpage/MatchMakerReviews";
import SportProfile from "./components/profile/SportProfile";
import ContactsFollowing from "./components/profile/ContactsFollowing";
import EditProfile from "./components/profile/EditProfile";
import TournamentEventsManagementCrudAdvanced
    from "./components/crud_all/components/tournament_management/TournamentEventsManagementCrudAdvanced";
import { useEffect } from "react";
import TeamManagementCrudAdvanced from "./components/crud_all/components/team_management/TeamManagementCrudAdvanced";
import HomePage from "./components/mainpage/HomePage";
import UpComingEvents from "./components/mainpage/UpComingEvents";
import HighLightsList from "./components/mainpage/HighLightsList";
import GlobalLoader from "./components/UI/GlobalLoader";


function App() {
    const isAuthenticated = useApplicationStore((state) => state.auth.isAuthenticated);

    useEffect(() => {
        handleCheck()
    }, []);

    let handleCheck = () => {
        if (!isAuthenticated) {
            const excludedPaths = ['/signin', '/signup', '/verification', '/verification_rq', '/reset_password', '/faq', '/reviews', '/'];

            if (!excludedPaths.includes(window.location.pathname)) {
                window.location.href = '/signin';
            }
        }
    }
    return (
        <Router>
            <div>
                <ScrollToTop />
                <GlobalLoader />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<MatchMaker />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/upcoming_events" element={<UpComingEvents />} />
                    <Route path="/highlights" element={<HighLightsList />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignInSide />} />
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/tournament" element={<TournamentEventsManagementCrudAdvanced />} />
                    </Route>
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/team" element={<TeamManagementCrudAdvanced />} />
                    </Route>
                    <Route path="/verification" element={<VerificationCodeInput />} />
                    <Route path="/verification_rq" element={<VerificationCodeInputRq />} />
                    <Route path="/reset_password" element={<ResetPassword />} />
                    <Route path="/faq" element={<MatchMakerFAQ />} />
                    <Route path="/reviews" element={<MatchMakerReviews />} />
                    <Route path="/profile" element={<SportProfile />} />
                    <Route path="/edit_profile" element={<EditProfile />} />
                    <Route path="/contacts" element={<ContactsFollowing />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
