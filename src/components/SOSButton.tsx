import { ShieldAlert, X, Phone, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
  isEmergency: boolean;
}

interface SOSButtonProps {
  onTrigger?: () => void;
  contacts?: Contact[];
}

export const SOSButton = ({ onTrigger, contacts = [] }: SOSButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleBuzzerClick = () => {
    setOpen(true);
    if (onTrigger) {
      onTrigger();
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center p-10">
        <div className="buzzer-shadow-ring animate-pulse" />
        <div 
          onClick={handleBuzzerClick}
          className="buzzer-3d mx-auto group"
        >
          <div className="flex flex-col items-center">
            <span className="sos-label">SOS</span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] -mt-1 group-hover:text-white/80 transition-colors">Press to Alert</span>
          </div>
        </div>
      </div>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg rounded-[2.5rem] bg-background p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
              <button 
                onClick={() => setOpen(false)} 
                className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-all" 
                aria-label="Close"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive animate-pulse mb-6">
                  <ShieldAlert size={40} />
                </div>
                
                <h2 className="font-display text-3xl font-black tracking-tight text-foreground">Distress Signal Active</h2>
                <p className="mt-4 text-muted-foreground font-medium leading-relaxed">
                  Your live location has been broadcasted to authorities and your trusted circle.
                </p>
                
                <div className="mt-10 w-full space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 text-center">Emergency Contacts</h3>
                    <div className="grid gap-3">
                      {contacts.length > 0 ? (
                        contacts.map(contact => (
                          <a 
                            key={contact.id}
                            href={`tel:${contact.phone}`}
                            className="flex items-center justify-between bg-secondary/50 p-4 rounded-2xl border border-border/40 hover:bg-destructive hover:text-white transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-background text-foreground group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <UserIcon size={18} />
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-sm tracking-tight leading-none">{contact.name}</p>
                                <p className="text-[10px] font-bold uppercase mt-1 opacity-60 tracking-wider font-mono">{contact.relation} • {contact.phone}</p>
                              </div>
                            </div>
                            <Phone size={18} className="mr-2" />
                          </a>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic mb-4">No emergency contacts configured.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-destructive py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-destructive/30 transition-all hover:brightness-110 active:scale-[0.98]">
                      <Phone size={18} />
                      Dispatch Authorities
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-secondary active:scale-[0.98]"
                    >
                      Dismiss Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
