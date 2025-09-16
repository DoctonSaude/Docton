import React from 'react';
import { Video, Plus, Calendar } from 'lucide-react';

export default function BoardMeeting({ meeting }: { meeting: any }) {
  if (!meeting || !meeting.attendees) {
    return null; // Não renderiza nada se não houver dados
  }

  return (
    <div className="bg-indigo-900 text-white rounded-xl p-6 flex flex-col">
      <h3 className="text-lg font-semibold text-indigo-100 mb-1">Board meeting</h3>
      <div className="flex items-center space-x-2 text-sm text-indigo-300 mb-4">
        <Calendar className="w-4 h-4" />
        <span>{meeting.date}</span>
        <span>|</span>
        <span>{meeting.time}</span>
      </div>
      
      <div className="flex-1 border-t border-indigo-700 pt-4 mb-4">
        <p className="text-sm text-indigo-300 mb-2">Attendees</p>
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {meeting.attendees.map((attendee: any) => (
              <img
                key={attendee.id}
                src={attendee.src}
                alt="attendee"
                className="w-8 h-8 rounded-full border-2 border-indigo-900"
              />
            ))}
          </div>
          <button className="w-8 h-8 rounded-full bg-indigo-700 hover:bg-indigo-600 flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      <button className="w-full mt-auto py-2 flex items-center justify-center space-x-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition-colors">
        <Video className="w-4 h-4" />
        <span className="text-sm font-semibold">Join the meeting</span>
      </button>
    </div>
  );
}