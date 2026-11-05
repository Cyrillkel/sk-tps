"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { workStages } from "@/entities/company";
import { ArrowRightIcon } from "@/shared/ui";

export function WorkStages() {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const stage = workStages[activeIndex] ?? workStages[0];

  function selectStage(index: number, focus = false) {
    setActiveIndex(index);
    if (focus) buttons.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let next = activeIndex;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (activeIndex + 1) % workStages.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (activeIndex + workStages.length - 1) % workStages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = workStages.length - 1;
    else return;
    event.preventDefault();
    selectStage(next, true);
  }

  return (
    <div className="work-stages">
      <div role="tablist" aria-label="Этапы работы" className="stage-tabs grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-4">
        {workStages.map((item, index) => (
          <button
            key={item.label}
            ref={(element) => { buttons.current[index] = element; }}
            id={`stage-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`stage-panel-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => selectStage(index)}
            onKeyDown={handleKeyDown}
            className={`stage-tab ${activeIndex === index ? "stage-tab-active" : ""}`}
          >
            <span className="stage-dot hidden lg:block" aria-hidden="true" />
            <span className="shrink-0 text-[10px] tracking-widest">0{index + 1}</span>
            <span className="text-left text-xs font-medium sm:text-sm">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="stage-connector" aria-hidden="true"><i /></div>
      {workStages.map((item, index) => (
        <div key={item.label} id={`stage-panel-${index}`} role="tabpanel" aria-labelledby={`stage-tab-${index}`} hidden={activeIndex !== index} tabIndex={0} className="stage-panel">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-sm font-semibold text-accent">0{index + 1}</span>
            <h2 className="flex-1 text-lg font-bold text-hero-foreground sm:text-xl">{item.title}</h2>
            <span className="hidden text-[10px] whitespace-nowrap text-hero-muted sm:inline">Этап {index + 1} из {workStages.length}</span>
          </div>
          <p className="text-sm leading-relaxed text-hero-muted">{item.description}</p>
          <button type="button" onClick={() => selectStage((activeIndex + 1) % workStages.length, true)} aria-label={`Следующий этап: ${workStages[(activeIndex + 1) % workStages.length]?.label ?? stage.label}`} className="mt-3 ml-auto flex min-h-8 items-center gap-3 text-xs text-hero-muted hover:text-accent">
            0{(activeIndex + 1) % workStages.length + 1} <ArrowRightIcon className="size-5 text-accent" />
          </button>
        </div>
      ))}
    </div>
  );
}
