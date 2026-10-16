import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  AlertCircle, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Sidebar Context
const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-3 py-4 hidden md:flex md:flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 z-20 shadow-sm",
        className
      )}
      animate={{
        width: animate ? (open ? "240px" : "68px") : "240px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 flex flex-row md:hidden items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 w-full"
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">Whitespace CRM</span>
        </div>
        <div className="flex justify-end z-20">
          <Menu
            className="text-slate-700 dark:text-slate-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-slate-900 p-6 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 text-slate-700 dark:text-slate-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({ link, isActive, className, ...props }) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.path}
      title={!open ? link.label : undefined}
      className={cn(
        "transition-all duration-150 group relative",
        open
          ? "w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
          : "w-10 h-10 mx-auto flex items-center justify-center rounded-xl p-0",
        isActive 
          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex-shrink-0 transition-colors flex items-center justify-center",
        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200"
      )}>
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm tracking-tight truncate whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

// Logo Components
export const Logo = () => {
  return (
    <div className="flex items-center gap-3 px-1 py-1 relative z-20">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
        <Sparkles className="h-5 w-5" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col"
      >
        <span className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight tracking-tight">
          Whitespace
        </span>
        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Manager Portal
        </span>
      </motion.div>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="w-10 h-10 mx-auto flex items-center justify-center py-1 relative z-20" title="Whitespace Manager Portal">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
        <Sparkles className="h-5 w-5" />
      </div>
    </div>
  );
};

// Main Demo Component
export default function SidebarManager() {
  const location = useLocation();

  const links = [
    {
      label: "Manager Dashboard",
      path: "/manager/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Team Overview",
      path: "/manager/team",
      icon: <Users className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Assign Tasks",
      path: "/manager/assign",
      icon: <UserCheck className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Review Rejections",
      path: "/manager/review-rejection",
      icon: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
    },
  ];
  
  const [open, setOpen] = useState(false);
  
  return (
    <div className="h-screen w-full bg-slate-50/70 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-1.5">
              {links.map((link, idx) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <SidebarLink key={idx} link={link} isActive={isActive} />
                );
              })}
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                MP
              </div>
              {open && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Manager Portal</span>
                  <span className="text-[11px] text-slate-500 truncate">manager@whitespace.ai</span>
                </div>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/70 dark:bg-slate-950 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}