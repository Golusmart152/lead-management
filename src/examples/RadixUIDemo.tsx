import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";

// ============================================================================
// DIALOG COMPONENT EXAMPLE
// ============================================================================

export function DialogExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Open Dialog
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="bg-white rounded-lg p-6 shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] max-h-[85vh] overflow-auto">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Edit Lead
          </Dialog.Title>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter lead name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter email"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 border rounded hover:bg-gray-50">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save
              </button>
            </Dialog.Close>
          </div>
          
          <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ============================================================================
// DROPDOWN MENU EXAMPLE
// ============================================================================

export function DropdownMenuExample() {
  const leadActions = [
    { label: "Edit Lead", icon: "✏️", onClick: () => console.log("Edit") },
    { label: "Mark as Contacted", icon: "📞", onClick: () => console.log("Contacted") },
    { label: "Schedule Follow-up", icon: "📅", onClick: () => console.log("Schedule") },
    { type: "separator" as const },
    { label: "Delete Lead", icon: "🗑️", onClick: () => console.log("Delete"), destructive: true },
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">
          Actions ▼
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white rounded-md shadow-lg border min-w-[200px] p-1 z-50">
          {leadActions.map((action, index) => 
            action.type === "separator" ? (
              <DropdownMenu.Separator key={index} className="h-px bg-gray-200 my-1" />
            ) : (
              <DropdownMenu.Item
                key={index}
                className={`
                  px-3 py-2 text-sm rounded cursor-pointer outline-none
                  ${action.destructive 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'hover:bg-gray-100'
                  }
                `}
                onClick={action.onClick}
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </DropdownMenu.Item>
            )
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// ============================================================================
// TOOLTIP COMPONENT EXAMPLE
// ============================================================================

export function TooltipExample() {
  return (
    <div className="flex items-center space-x-4 p-6">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600">
              ?
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content 
              className="bg-gray-800 text-white text-sm rounded px-2 py-1 max-w-[200px] text-center"
              side="top"
              sideOffset={5}
            >
              This lead has been contacted 3 times this month
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Save Lead
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content 
              className="bg-gray-800 text-white text-sm rounded px-2 py-1"
              side="bottom"
              sideOffset={5}
            >
              Click to save this lead to your CRM
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}

// ============================================================================
// COMBINED USAGE EXAMPLE - LEAD CARD WITH ALL THREE COMPONENTS
// ============================================================================

interface Lead {
  id: string;
  name: string;
  email: string;
  status: "new" | "contacted" | "qualified" | "lost";
  lastContact?: Date;
}

export function LeadCard({ lead }: { lead: Lead }) {
  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "qualified": return "bg-green-100 text-green-800";
      case "lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Lead["status"]) => {
    switch (status) {
      case "new": return "🆕";
      case "contacted": return "📞";
      case "qualified": return "✅";
      case "lost": return "❌";
      default: return "❓";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with Dropdown Menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-500">{lead.email}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                ⋮
              </button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-md shadow-lg border min-w-[150px] p-1 z-50">
                <DropdownMenu.Item className="px-3 py-2 text-sm rounded cursor-pointer outline-none hover:bg-gray-100">
                  Edit Details
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-3 py-2 text-sm rounded cursor-pointer outline-none hover:bg-gray-100">
                  Add Note
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                <DropdownMenu.Item className="px-3 py-2 text-sm text-red-600 rounded cursor-pointer outline-none hover:bg-red-50">
                  Delete Lead
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Status Badge with Tooltip */}
      <div className="flex items-center space-x-2 mb-3">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                <span className="mr-1">{getStatusIcon(lead.status)}</span>
                {lead.status}
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content 
                className="bg-gray-800 text-white text-xs rounded px-2 py-1 max-w-[250px]"
                side="top"
                sideOffset={5}
              >
                Lead status: {lead.status}. Click to update status.
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        {lead.lastContact && (
          <span className="text-xs text-gray-500">
            Last contact: {lead.lastContact.toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content 
                className="bg-gray-800 text-white text-xs rounded px-2 py-1"
                side="bottom"
                sideOffset={5}
              >
                Open lead details and activity timeline
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        {/* Quick Actions Dialog */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
              Quick Edit
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0" />
            <Dialog.Content className="bg-white rounded-lg p-6 shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw]">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Quick Edit: {lead.name}
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select className="w-full p-2 border rounded-md" title="Select lead status">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea 
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Add notes about this lead..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 border rounded hover:bg-gray-50">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Save Changes
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export default function RadixUIDemo() {
  const sampleLeads: Lead[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "new",
      lastContact: new Date("2024-01-15"),
    },
    {
      id: "2", 
      name: "Jane Smith",
      email: "jane@example.com",
      status: "contacted",
      lastContact: new Date("2024-01-10"),
    },
    {
      id: "3",
      name: "Bob Johnson", 
      email: "bob@example.com",
      status: "qualified",
      lastContact: new Date("2024-01-08"),
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Radix UI Components Demo</h1>
      
      {/* Individual Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Individual Components</h2>
        <div className="flex flex-wrap gap-4">
          <DialogExample />
          <DropdownMenuExample />
          <TooltipExample />
        </div>
      </section>

      {/* Combined Usage Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Lead Management Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </section>
    </div>
  );
}