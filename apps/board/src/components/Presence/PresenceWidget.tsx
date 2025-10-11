import { Users } from 'lucide-solid';
import { Widget } from '../Shared/Widget';

export const PresenceWidget = () => (
  <Widget title="Active Users" position="bottom-left">
    <div class="space-y-3">
      {/* Online Users Placeholder */}
      <div class="space-y-2">
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="relative">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">JD</span>
            </div>
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">John Doe</p>
            <p class="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="relative">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">AS</span>
            </div>
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Alice Smith</p>
            <p class="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="relative">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">BJ</span>
            </div>
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Bob Johnson</p>
            <p class="text-xs text-gray-500">Away</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div class="pt-3 border-t border-gray-200">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <Users class="w-4 h-4" />
          <span>3 users online</span>
        </div>
      </div>
    </div>
  </Widget>
);
