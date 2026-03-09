import { ShieldAlert, X, Phone } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

export const SOSButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="sos-pulse flex w-full items-center justify-center gap-2 rounded-xl bg-destructive py-4 text-sm font-bold text-destructive-foreground transition-all hover:brightness-110"
      >
        <ShieldAlert size={20} />
        SOS Emergency
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-background p-10 shadow-2xl">
              <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" aria-label="Close">
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <ShieldAlert size={32} className="text-destructive" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold">Emergency Alert Sent</h2>
                <p className="mt-2 text-muted-foreground">
                  Your live location is being shared with your emergency contacts and SafeGo admin.
                </p>
                <div className="mt-6 flex w-full flex-col gap-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full rounded-full border-2 border-border py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                  >
                    Cancel — False Alarm
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-destructive py-3 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110">
                    <Phone size={16} />
                    Call Emergency Services
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
