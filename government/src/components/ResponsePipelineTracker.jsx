import { RESPONSE_PIPELINE_STAGES } from "../data/maharashtraData";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";

export default function ResponsePipelineTracker() {
  const { lang } = useApp();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const stageLabels = {
    reported: t.stageReported,
    triage: t.stageTriage,
    field: t.stageField,
    sample: t.stageSample,
    lab: t.stageLab,
    confirm: t.stageConfirm,
    control: t.stageControl,
    resolved: t.stageResolved,
  };

  return (
    <div className="pipeline-panel">
      <div className="pipeline-panel__header">
        <div>
          <h3 className="pipeline-panel__title">{t.pipelineTitle}</h3>
          <p className="pipeline-panel__subtitle">{t.pipelineSubtitle}</p>
        </div>
        <div className="pipeline-total-badge">{t.totalEvents}</div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="pipeline-flow">
        {RESPONSE_PIPELINE_STAGES.map((stage, idx) => (
          <div
            key={stage.id}
            className={`pipeline-step ${stage.bottleneck ? "pipeline-step--bottleneck" : ""}`}
          >
            <div className="pipeline-step__num">0{idx + 1}</div>
            <div className="pipeline-step__content">
              <div className="pipeline-step__title-row">
                <span className="pipeline-step__title">{stageLabels[stage.id] || stage.label}</span>
                <span className="pipeline-step__count">{stage.count}</span>
              </div>
              <p className="pipeline-step__desc">{stage.description}</p>
              {stage.bottleneck && (
                <div className="bottleneck-tag">
                  {t.bottleneckNotice}
                </div>
              )}
            </div>
            {idx < RESPONSE_PIPELINE_STAGES.length - 1 && (
              <span className="pipeline-arrow" aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
