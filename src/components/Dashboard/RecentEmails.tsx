import React, { useState } from 'react';
import { Star, Mail } from 'lucide-react';

// Dados de exemplo para os e-mails
const initialEmails = [
  { id: 1, sender: 'John Doe', subject: 'Question about project', tag: 'Question', time: '8:24 AM', isStarred: true, read: false },
  { id: 2, sender: 'Jane Smith', subject: 'Meeting update', tag: 'Meeting', time: '7:51 AM', isStarred: false, read: false },
  { id: 3, sender: 'HR Department', subject: 'Company-wide announcement', tag: 'Announcement', time: 'Yesterday', isStarred: false, read: true },
  { id: 4, sender: 'Peter Jones', subject: 'Re: Your invoice', tag: 'Invoice', time: 'Yesterday', isStarred: true, read: true },
];

const tagColors: { [key: string]: string } = {
  'Question': 'bg-orange-100 text-orange-800',
  'Meeting': 'bg-blue-100 text-blue-800',
  'Announcement': 'bg-purple-100 text-purple-800',
  'Invoice': 'bg-green-100 text-green-800',
};

export default function RecentEmails() {
  const [emails, setEmails] = useState(initialEmails);

  const toggleStar = (id: number) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent emails</h3>
        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold">View all</a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {emails.map(email => (
              <tr key={email.id} className={`hover:bg-gray-50 ${!email.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                {/* Checkbox */}
                <td className="p-3 w-10 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                
                {/* Star Icon */}
                <td className="p-3 w-10 text-center">
                  <button onClick={() => toggleStar(email.id)}>
                    <Star className={`w-5 h-5 transition-colors ${email.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-gray-400'}`} />
                  </button>
                </td>
                
                {/* Sender */}
                <td className="p-3 whitespace-nowrap">
                  {email.sender}
                </td>
                
                {/* Subject and Tag */}
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <span>{email.subject}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[email.tag] || 'bg-gray-100 text-gray-800'}`}>
                      {email.tag}
                    </span>
                  </div>
                </td>
                
                {/* Time */}
                <td className="p-3 w-32 text-right text-gray-500 whitespace-nowrap">
                  {email.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}