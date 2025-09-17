import { useEffect, useState } from "react";

interface PathProps {
  compact: boolean;
  eventIds: string[];
  getEventName: (eventId: string) => Promise<string>
  onClickEvent?: (eventId: string) => Promise<void>
}




export default function Path({ compact = false, eventIds, getEventName, onClickEvent }: PathProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [events, setEvents] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (Array.isArray(eventIds)) {
      setEvents(Object.fromEntries(eventIds.map(id => [id, undefined])));
      setCurrentId(eventIds[eventIds.length - 1]);
    }
  }, [eventIds]);

  const eventName = (id: string) => {
    if (events[id]) return events[id];
    getEventName(id).then(name => setEvents(events => ({ ...events, [id]: name })));
    return "loading";
  }

  const clickEvent = async (id: string) => {
    setCurrentId(id);
    await onClickEvent?.(id);
  }
  const nodeSize = compact ? 'w-6 h-6' : 'w-8 h-8';
  const nodeInner = compact ? 'w-3 h-3' : 'w-4 h-4';

  // const events: Event[] = [
  //   { id: 1, title: 'Question A just make it show' },
  //   { id: 2, title: 'Question B' },
  //   { id: 3, title: 'Question C', },
  //   { id: 4, title: 'Question D', },
  //   { id: 5, title: 'Question E', isCurrent: true },
  //   { id: 6, title: 'Question A just make it show' },
  //   { id: 7, title: 'Question B' },
  //   { id: 8, title: 'Question C', },
  //   { id: 9, title: 'Question D', },
  //   { id: 10, title: 'Question A just make it show' },
  //   { id: 11, title: 'Question B' },
  //   { id: 12, title: 'Question C', },
  //   { id: 13, title: 'Question D', },
  //   { id: 14, title: 'Question C', },
  //   { id: 15, title: 'Question D', },
  //   { id: 16, title: 'Question D', },
  //   { id: 17, title: 'Question C', },
  //   { id: 18, title: 'Question D', },
  // ]

  return (
    <div className="w-full px-6 py-4 border rounded-lg shadow-sm bg-white">
      {/* Collapse Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-end w-full text-left text-gray-700 font-medium focus:outline-none cursor-pointer"
      >
        <span className="ml-2 text-sm text-gray-500">{isOpen ? '−' : '+'}</span>
      </button>


      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden  ${isOpen ? 'max-h-[500px] mt-4' : 'max-h-0'
          }`}
      >
        <div className="relative py-8">
          {/* Horizontal line */}
          <div className="absolute left-6 right-6 top-1/2 transform -translate-y-1/2">
            <div className="h-1 bg-gray-200 rounded-full" />
          </div>


          {/* Nodes */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            {Object.keys(events).map((id) => (
              <div key={id} className="group flex-1 flex items-center justify-center relative">
                {/* Tooltip shown on hover */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out select-none">
                    <div className="mb-1 text-sm text-black text-center px-2 py-1 rounded-md shadow-lg bg-white border border-gray-100 whitespace-nowrap">
                      {eventName(id)}
                    </div>
                    <div className="w-0 h-0 mx-auto border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-white -mt-1" />
                  </div>
                </div>


                {/* Node button */}
                <button
                  aria-current={currentId === id ? 'true' : 'false'}
                  className={`relative flex items-center justify-center ${nodeSize} rounded-full transition-transform transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentId === id ? 'bg-green-400 ring-4 ring-green-200 scale-105' : 'bg-white border-2 border-gray-300 hover:scale-110'} cursor-pointer`}
                  title={eventName(id)}
                  onClick={() => clickEvent(id)}
                >
                  <span className={`${nodeInner} rounded-full ${currentId === id ? 'bg-white' : 'bg-gray-400'}`} />
                </button>


                {/* Optional label under node */}
                <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 hidden sm:block text-center max-w-[6rem] truncate">
                  {eventName(id)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}