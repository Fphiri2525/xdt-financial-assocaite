import { Image as ImageIcon } from 'lucide-react';

const ProfileSettings = () => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-50">
    <h3 className="text-lg font-semibold text-[#0B3C5D] mb-4">Profile Settings</h3>
    
    <form className="space-y-4">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ImageIcon className="text-gray-400" size={32} />
        </div>
        <button type="button" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
          Update Photo
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
          <input 
            type="tel" 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]"
            defaultValue="+265 888 123 456"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Address</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]"
            defaultValue="Area 25, Lilongwe"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">New Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D]"
            placeholder="••••••••"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">National ID: <span className="font-medium">MW-123456-78</span></p>
        <p className="text-xs text-gray-500 mt-1">National ID cannot be changed. Contact support for corrections.</p>
      </div>
      
      <button type="button" className="w-full bg-[#0B3C5D] text-white py-3 rounded-lg hover:bg-[#082d47] transition-colors font-medium">
        Save Changes
      </button>
    </form>
  </div>
);

export default ProfileSettings;
