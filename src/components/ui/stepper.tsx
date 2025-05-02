import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface StepperContextValue {
  index: number;
}

const StepperContext = createContext<StepperContextValue>({ index: 0 });

export function useSteps({ index, count }: { index: number; count: number }) {
  return {
    activeStep: index,
    setActiveStep: (i: number) => {
      return i;
    },
    isActiveStep: (i: number) => index === i,
    isCompleteStep: (i: number) => index > i,
    isIncompleteStep: (i: number) => index < i,
  };
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  children: React.ReactNode;
}

export function Stepper({ index, children, className, ...props }: StepperProps) {
  return (
    <StepperContext.Provider value={{ index }}>
      <div
        data-orientation="horizontal"
        className={cn("flex w-full justify-between gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Step({ children, className, ...props }: StepProps) {
  return (
    <div className={cn("flex flex-1 flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
}

interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function StepIndicator({ children, className, ...props }: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface StepStatusProps {
  complete: React.ReactNode;
  incomplete: React.ReactNode;
  active: React.ReactNode;
}

export function StepStatus({ complete, incomplete, active }: StepStatusProps) {
  const { index } = useContext(StepperContext);
  const step = React.useContext(React.createContext<number>(0));
  
  if (index > step) {
    return <div className="text-white bg-primary rounded-full">{complete}</div>;
  }
  
  if (index === step) {
    return <div className="text-primary-foreground bg-primary rounded-full h-10 w-10 flex items-center justify-center">{active}</div>;
  }
  
  return <div>{incomplete}</div>;
}

interface StepTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function StepTitle({ children, className, ...props }: StepTitleProps) {
  return (
    <p className={cn("font-medium", className)} {...props}>
      {children}
    </p>
  );
}

interface StepDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function StepDescription({ children, className, ...props }: StepDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function StepSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-orientation="horizontal"
      className={cn("h-0.5 flex-1 bg-muted", className)}
      {...props}
    />
  );
}
