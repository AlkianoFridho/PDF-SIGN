"use client";

import { Rnd } from "react-rnd";
import { QRCodeSVG } from "qrcode.react";
import { useEditor } from "@/lib/editor-context";

const handleStyles: Record<string, React.CSSProperties> = {
  topLeft: { background: "#6366f1", borderRadius: 2, border: "1px solid #fff" },
  topRight: { background: "#6366f1", borderRadius: 2, border: "1px solid #fff" },
  bottomLeft: { background: "#6366f1", borderRadius: 2, border: "1px solid #fff" },
  bottomRight: { background: "#6366f1", borderRadius: 2, border: "1px solid #fff" },
  top: { background: "#6366f1" },
  bottom: { background: "#6366f1" },
  left: { background: "#6366f1" },
  right: { background: "#6366f1" },
};

export default function ElementLayer() {
  const {
    elements,
    currentPage,
    selectedId,
    setSelectedId,
    updateElement,
    removeElement,
  } = useEditor();

  return (
    <div id="element-layer" className="absolute inset-0">
      {elements
        .filter((el) => el.page === currentPage - 1)
        .map((el) => {
          const selected = selectedId === el.id;
          return (
            <Rnd
              key={el.id}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              bounds="parent"
              enableResizing={selected}
              resizeHandleStyles={handleStyles}
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedId(el.id);
              }}
              onDragStop={(_, data) => updateElement(el.id, { x: data.x, y: data.y })}
              onResizeStop={(_, __, ref, ___, position) =>
                updateElement(el.id, {
                  x: position.x,
                  y: position.y,
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                })
              }
              className={selected ? "z-10" : ""}
            >
              <div
                className={`h-full w-full rounded-sm ${
                  selected ? "ring-2 ring-indigo-500 ring-offset-1" : ""
                }`}
              >
                {el.type === "qrcode" ? (
                  <QRCodeSVG
                    value={el.data}
                    size={100}
                    level="M"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <img
                    src={el.data}
                    alt=""
                    draggable={false}
                    className="pointer-events-none h-full w-full select-none object-contain"
                  />
                )}
              </div>

              {selected && (
                <button
                  type="button"
                  aria-label="Hapus elemen"
                  title="Hapus elemen"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={() => removeElement(el.id)}
                  className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </Rnd>
          );
        })}
    </div>
  );
}
