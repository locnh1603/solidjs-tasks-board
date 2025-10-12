import { Show, createEffect, createSignal } from 'solid-js';
import { LogIn, LogOut, User } from 'lucide-solid';
import { authActions, authState } from '../../stores/authStore';
import { Button } from '../Shared/Button';
import { Dropdown } from '../Shared/Dropdown';
import { DateTime } from 'luxon';

export interface HeaderProps {
  onLoginClick: () => void;
}

export const Header = (props: HeaderProps) => {
  const handleLogout = async () => {
    await authActions.signOut();
  };

  const timezoneOptions = [
    { label: 'UTC+0', value: 'UTC' },
    { label: 'UTC-5', value: 'America/New_York' },
    { label: 'UTC+0', value: 'Europe/London' },
    { label: 'UTC+9', value: 'Asia/Tokyo' },
    { label: 'UTC+11', value: 'Australia/Sydney' },
    { label: 'UTC+7', value: 'Asia/Ho_Chi_Minh' },
    // Add more as needed
  ];
  const [timezone, setTimezone] = createSignal('UTC');
  const [clock, setClock] = createSignal('');

  createEffect(() => {
    const updateClock = () => {
      setClock(DateTime.now().setZone(timezone()).toFormat('HH:mm'));
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  });

  return (
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div class="flex items-center">
            <h1 class="text-2xl font-bold bg-clip-text text-transparent">TaskBoard</h1>
          </div>

          {/* Auth Section */}
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Dropdown
                options={timezoneOptions}
                value={timezone()}
                onChange={setTimezone}
                placeholder="Select Timezone"
                size="sm"
              />
              <span class="text-xs text-gray-500 font-mono min-w-[40px] text-right">{clock()}</span>
            </div>
            <Show
              when={authState.user}
              fallback={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<LogIn class="w-4 h-4" />}
                  onClick={() => props.onLoginClick()}
                >
                  Login
                </Button>
              }
            >
              {/* User Info Placeholder */}
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                  <User class="w-4 h-4 text-indigo-600" />
                  <span class="text-sm font-medium text-gray-700">
                    {authState.profile?.username ?? authState.user?.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LogOut class="w-4 h-4" />}
                  onClick={() => void handleLogout()}
                >
                  Logout
                </Button>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
};
