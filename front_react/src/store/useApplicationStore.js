import { create } from 'zustand';
import auth from './modules/auth';
import loader from './modules/loader';
import event from './modules/event';
import singleEvent from './modules/singleEvent';
import team from './modules/team';
import user from './modules/user';
import twoTeamEvent from './modules/twoTeamEvent';
import tableEvent from './modules/tableEvent';

const useApplicationStore = create((set, get) => ({
  ...loader(set, get),
  ...auth(set, get),
  ...event(set, get),
  ...twoTeamEvent(set, get),
  ...singleEvent(set, get),
  ...user(set, get),
  ...team(set, get),
  ...tableEvent(set, get),
}));

export default useApplicationStore;