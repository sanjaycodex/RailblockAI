import React, { createContext, useContext, useState, useEffect } from 'react';
import { fastapiService } from '../services/fastapiService';
import { api } from '../services/api';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [corridorTwinState, setCorridorTwinState] = useState(null);
  const [loadingTwin, setLoadingTwin] = useState(false);
  const [lastAcceptedReplan, setLastAcceptedReplan] = useState(null);

  const fetchTwinState = async () => {
    setLoadingTwin(true);
    try {
      const data = await fastapiService.getDigitalTwinCorridorState('CORR-SR-TEN-MDU');
      setCorridorTwinState(data);
    } catch (e) {
      console.warn('FastAPI digital twin fetch fallback to api.js:', e);
      try {
        const [sections, stations, tasks, trains, windows] = await Promise.all([
          api.getSections('CORR-SR-TEN-MDU'),
          api.getStations('CORR-SR-TEN-MDU'),
          api.getTasks(),
          api.getTrainMovements(),
          api.getAvailableWindows()
        ]);

        const mappedSections = sections.map((sec) => {
          const secTasks = tasks.filter((t) => t.section_id === sec.id);
          const critical = secTasks.filter((t) => t.severity === 'Critical' || t.priority_level === 'P1 Critical');
          const health = parseFloat(sec.asset_health_score || 90);
          const colorState = critical.length > 0 ? (health < 85 ? 'ORANGE' : 'YELLOW') : (health < 85 ? 'YELLOW' : 'GREEN');
          return {
            section: sec,
            color_state: colorState,
            open_tasks: secTasks.length,
            critical_tasks: critical.length,
            high_risk_assets: secTasks.filter((t) => parseFloat(t.failure_risk || 0) > 80).length,
            scheduled_blocks: 0,
            active_blocks: 0,
            available_windows: windows.filter((w) => w.section_id === sec.id).length,
            trains_active: trains.filter((t) => t.section_id === sec.id).length,
            tasks: secTasks,
            blocks: [],
            windows: windows.filter((w) => w.section_id === sec.id)
          };
        });

        setCorridorTwinState({
          corridor_id: 'CORR-SR-TEN-MDU',
          stations,
          sections: mappedSections,
          total_tasks: tasks.length,
          total_blocks: 0,
          total_trains: trains.length
        });
      } catch (err) {
        console.error('Digital Twin fallback failed:', err);
      }
    } finally {
      setLoadingTwin(false);
    }
  };

  const triggerSimulation = (simPayload) => {
    setActiveSimulation(simPayload);
  };

  const clearSimulation = () => {
    setActiveSimulation(null);
  };

  const recordAcceptedReplan = (replanData) => {
    setLastAcceptedReplan(replanData);
    setActiveSimulation(null);
    fetchTwinState();
  };

  useEffect(() => {
    fetchTwinState();
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        activeSimulation,
        corridorTwinState,
        loadingTwin,
        lastAcceptedReplan,
        triggerSimulation,
        clearSimulation,
        recordAcceptedReplan,
        refreshTwinState: fetchTwinState
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return ctx;
}
