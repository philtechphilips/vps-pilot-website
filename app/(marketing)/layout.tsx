import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { MotionRoot } from "@/components/motion-root";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-bg">
      {/* Without JS nothing would ever be revealed, so show everything. */}
      <noscript>
        <style>
          {"[data-reveal],.display .line>span,.glyph{opacity:1!important;transform:none!important;filter:none!important}"}
        </style>
      </noscript>
      <MotionRoot />
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
