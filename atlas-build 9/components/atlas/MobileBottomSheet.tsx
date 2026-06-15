'use client';

interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function MobileBottomSheet({
  open,
  onClose,
  children,
  title,
}: MobileBottomSheetProps) {
  if (!open) return null;

  return (
    <>
      {/* Minimal overlay - no blur, very subtle */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.15)',
          zIndex: 40,
          backdropFilter: 'none',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px 18px 0 0',
          zIndex: 50,
          maxHeight: '62dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            padding: '12px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            position: 'sticky',
            top: 0,
            background: '#050505',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '4px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '2px',
              margin: '0 auto',
            }}
          />
          {title && (
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                marginTop: '8px',
              }}
            >
              {title}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          {children}
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
