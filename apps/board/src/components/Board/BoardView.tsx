import { Kanban } from 'lucide-solid';

export const BoardView = () => (
  <div class="flex-1 p-6">
    <div class="max-w-7xl mx-auto">
      {/* Board Header */}
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Kanban class="w-8 h-8 text-indigo-600" />
          My Task Board
        </h2>
        <p class="mt-2 text-gray-600">Manage your tasks efficiently with our Kanban board</p>
      </div>

      {/* Board Placeholder Content */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="text-center py-12">
          <Kanban class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Board Component</h3>
          <p class="text-gray-600 max-w-md mx-auto">
            This is a placeholder for the main Kanban board component. The board will display task
            columns (To Do, In Progress, Done) with drag-and-drop functionality.
          </p>
          <div class="mt-6 flex gap-4 justify-center">
            <div class="px-4 py-8 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 w-48">
              <p class="text-sm font-medium text-blue-900">To Do</p>
              <p class="text-xs text-blue-600 mt-1">0 tasks</p>
            </div>
            <div class="px-4 py-8 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-200 w-48">
              <p class="text-sm font-medium text-yellow-900">In Progress</p>
              <p class="text-xs text-yellow-600 mt-1">0 tasks</p>
            </div>
            <div class="px-4 py-8 bg-green-50 rounded-lg border-2 border-dashed border-green-200 w-48">
              <p class="text-sm font-medium text-green-900">Done</p>
              <p class="text-xs text-green-600 mt-1">0 tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
