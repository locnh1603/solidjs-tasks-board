import { MessageCircle, Send } from 'lucide-solid';
import { Widget } from '../Shared/Widget';

export const ChatWidget = () => (
  <Widget title="Team Chat" position="bottom-right">
    <div class="space-y-4">
      {/* Chat Messages Placeholder */}
      <div class="space-y-3 min-h-[200px]">
        <div class="flex items-start gap-2">
          <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle class="w-4 h-4 text-indigo-600" />
          </div>
          <div class="flex-1">
            <div class="bg-gray-100 rounded-lg p-2">
              <p class="text-sm text-gray-800">Welcome to the team chat!</p>
            </div>
            <p class="text-xs text-gray-500 mt-1">System • Just now</p>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-medium text-blue-600">JD</span>
          </div>
          <div class="flex-1">
            <div class="bg-blue-50 rounded-lg p-2">
              <p class="text-sm text-gray-800">
                Chat widget placeholder - messages will appear here
              </p>
            </div>
            <p class="text-xs text-gray-500 mt-1">John Doe • 2 min ago</p>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div class="flex gap-2 pt-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled
        />
        <button
          class="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <Send class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Widget>
);
