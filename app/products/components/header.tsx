interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="flex flex-col">
      {/* ✅ Gradient Title */}
      <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        {title}
      </h1>

      {/* ✅ Optional Subtitle */}
      {subtitle && (
        <p className="text-[11px] sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1 leading-snug sm:leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
