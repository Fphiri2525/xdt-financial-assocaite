interface NextOfKinSectionProps {
  nextOfKin: {
    name: string;
    phone: string;
    relationship: string;
    address: string;
  };
}

const NextOfKinSection = ({ nextOfKin }: NextOfKinSectionProps) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-50">
    <h3 className="text-lg font-semibold text-[#0B3C5D] mb-4">Next of Kin</h3>

    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      <div className="flex flex-col justify-between">
        <p className="text-xs text-gray-500 mb-1">Name</p>
        <p className="text-sm font-medium text-gray-800">{nextOfKin.name}</p>
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-xs text-gray-500 mb-1">Phone</p>
        <p className="text-sm font-medium text-gray-800">{nextOfKin.phone}</p>
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-xs text-gray-500 mb-1">Relationship</p>
        <p className="text-sm font-medium text-gray-800">{nextOfKin.relationship}</p>
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-xs text-gray-500 mb-1">Address</p>
        <p className="text-sm font-medium text-gray-800">{nextOfKin.address}</p>
      </div>
    </div>
  </div>
);

export default NextOfKinSection;