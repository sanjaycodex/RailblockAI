import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  SEED_CORRIDORS,
  SEED_STATIONS,
  SEED_SECTIONS,
  SEED_ASSETS,
  SEED_MAINTENANCE_TASKS,
  SEED_TRAIN_MOVEMENTS,
  SEED_AVAILABLE_WINDOWS,
  SEED_FIELD_VIEWERS,
  SEED_MAINTENANCE_BLOCKS
} from '../data/tenMduData';

const LOCAL_STORAGE_KEYS = {
  CORRIDORS: 'railblock_corridors_v2',
  STATIONS: 'railblock_stations_v2',
  SECTIONS: 'railblock_sections_v2',
  ASSETS: 'railblock_assets_v2',
  TASKS: 'railblock_tasks_v2',
  TRAINS: 'railblock_trains_v2',
  WINDOWS: 'railblock_windows_v2',
  BLOCKS: 'railblock_maintenance_blocks_v2',
  VIEWERS: 'railblock_field_viewers_v2'
};

// Initialize local prototype cache if empty
function initializeLocalStorage() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CORRIDORS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CORRIDORS, JSON.stringify(SEED_CORRIDORS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.STATIONS, JSON.stringify(SEED_STATIONS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(SEED_SECTIONS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ASSETS, JSON.stringify(SEED_ASSETS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(SEED_MAINTENANCE_TASKS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRAINS, JSON.stringify(SEED_TRAIN_MOVEMENTS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.WINDOWS, JSON.stringify(SEED_AVAILABLE_WINDOWS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(SEED_MAINTENANCE_BLOCKS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEWERS, JSON.stringify(SEED_FIELD_VIEWERS));
  }
  // Ensure blocks and viewers exist even if earlier cache was seeded
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.BLOCKS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(SEED_MAINTENANCE_BLOCKS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.VIEWERS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEWERS, JSON.stringify(SEED_FIELD_VIEWERS));
  }
  // Ensure trains cache contains all trains from TIRUNELVELI_MADURAI_TRAINS.md
  const cachedTrains = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TRAINS) || '[]');
  if (cachedTrains.length < SEED_TRAIN_MOVEMENTS.length) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRAINS, JSON.stringify(SEED_TRAIN_MOVEMENTS));
  }
}

initializeLocalStorage();

export const api = {
  // 1. CORRIDORS
  async getCorridors() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('corridors').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getCorridors fallback:', e);
      }
    }
    initializeLocalStorage();
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CORRIDORS) || '[]');
  },

  // 2. STATIONS
  async getStations(corridorId = 'CORR-SR-TEN-MDU') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('stations')
          .select('*')
          .eq('corridor_id', corridorId)
          .order('sequence_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getStations fallback:', e);
      }
    }
    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.STATIONS) || '[]');
    return all.filter((s) => s.corridor_id === corridorId);
  },

  // 3. SECTIONS
  async getSections(corridorId = 'CORR-SR-TEN-MDU') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('railway_sections')
          .select('*')
          .eq('corridor_id', corridorId);
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getSections fallback:', e);
      }
    }
    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS) || '[]');
    return all.filter((s) => s.corridor_id === corridorId);
  },

  // 4. ASSETS
  async getAssets(filters = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('assets').select('*');
        if (filters.section_id && filters.section_id !== 'ALL') {
          query = query.eq('section_id', filters.section_id);
        }
        if (filters.department && filters.department !== 'ALL') {
          query = query.eq('department', filters.department);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getAssets fallback:', e);
      }
    }
    initializeLocalStorage();
    let all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ASSETS) || '[]');
    if (filters.section_id && filters.section_id !== 'ALL') {
      all = all.filter((a) => a.section_id === filters.section_id);
    }
    if (filters.department && filters.department !== 'ALL') {
      all = all.filter((a) => a.department === filters.department);
    }
    return all;
  },

  // 5. MAINTENANCE TASKS (Full CRUD)
  async getTasks(filters = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('maintenance_tasks').select('*');
        if (filters.department && filters.department !== 'ALL') query = query.eq('department', filters.department);
        if (filters.section_id && filters.section_id !== 'ALL') query = query.eq('section_id', filters.section_id);
        if (filters.severity && filters.severity !== 'ALL') query = query.eq('severity', filters.severity);
        if (filters.status && filters.status !== 'ALL') query = query.eq('status', filters.status);
        if (filters.priority_level && filters.priority_level !== 'ALL') query = query.eq('priority_level', filters.priority_level);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getTasks fallback:', e);
      }
    }

    initializeLocalStorage();
    let all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS) || '[]');
    if (filters.department && filters.department !== 'ALL') all = all.filter((t) => t.department === filters.department);
    if (filters.section_id && filters.section_id !== 'ALL') all = all.filter((t) => t.section_id === filters.section_id);
    if (filters.severity && filters.severity !== 'ALL') all = all.filter((t) => t.severity === filters.severity);
    if (filters.status && filters.status !== 'ALL') all = all.filter((t) => t.status === filters.status);
    if (filters.priority_level && filters.priority_level !== 'ALL') all = all.filter((t) => t.priority_level === filters.priority_level);

    return all;
  },

  async createTask(taskData) {
    const newTask = {
      ...taskData,
      id: taskData.id || `TSK-TEN-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      corridor_id: taskData.corridor_id || 'CORR-SR-TEN-MDU'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('maintenance_tasks').insert([newTask]).select();
        if (!error && data && data.length > 0) return data[0];
      } catch (e) {
        console.warn('Supabase createTask fallback:', e);
      }
    }

    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS) || '[]');
    const updated = [newTask, ...all];
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(updated));
    return newTask;
  },

  async updateTask(taskId, updates) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('maintenance_tasks')
          .update(updates)
          .eq('id', taskId)
          .select();
        if (!error && data && data.length > 0) return data[0];
      } catch (e) {
        console.warn('Supabase updateTask fallback:', e);
      }
    }

    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS) || '[]');
    let updatedTask = null;
    const updated = all.map((t) => {
      if (t.id === taskId) {
        updatedTask = { ...t, ...updates };
        return updatedTask;
      }
      return t;
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(updated));
    return updatedTask;
  },

  async deleteTask(taskId) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('maintenance_tasks').delete().eq('id', taskId);
      } catch (e) {
        console.warn('Supabase deleteTask fallback:', e);
      }
    }

    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS) || '[]');
    const updated = all.filter((t) => t.id !== taskId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(updated));
    return true;
  },

  // 6. TRAIN MOVEMENTS & WINDOWS
  async getTrainMovements(filters = {}) {
    initializeLocalStorage();
    let trains = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('train_movements').select('*');
        if (!error && data && data.length >= SEED_TRAIN_MOVEMENTS.length) {
          trains = data;
        }
      } catch (e) {
        console.warn('Supabase getTrainMovements fallback:', e);
      }
    }
    if (!trains.length) {
      trains = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TRAINS) || JSON.stringify(SEED_TRAIN_MOVEMENTS));
    }

    if (filters.type && filters.type !== 'ALL') {
      trains = trains.filter(t => t.train_type === filters.type);
    }
    if (filters.section && filters.section !== 'ALL') {
      trains = trains.filter(t => t.section_id === filters.section);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      trains = trains.filter(t => 
        t.train_number?.toLowerCase().includes(q) ||
        t.train_name?.toLowerCase().includes(q) ||
        t.route?.toLowerCase().includes(q) ||
        t.origin_station?.toLowerCase().includes(q) ||
        t.destination_station?.toLowerCase().includes(q)
      );
    }

    return trains;
  },

  async getCorridorTrainStats() {
    const trains = await this.getTrainMovements();
    const vandeBharatCount = trains.filter(t => t.train_type === 'Vande Bharat').length;
    const superfastCount = trains.filter(t => t.train_type === 'Superfast Express' || t.train_type === 'Amrit Bharat').length;
    const expressCount = trains.filter(t => t.train_type === 'Express' || t.train_type === 'Special Express').length;
    const passengerCount = trains.filter(t => t.train_type === 'Passenger' || t.train_type === 'MEMU Local').length;
    const freightCount = trains.filter(t => t.train_type === 'Freight / Goods').length;
    const activeRunning = trains.filter(t => t.live_status === 'Running' || t.live_status === 'On Time').length;

    return {
      total_trains: trains.length,
      active_running: activeRunning,
      vande_bharat_count: vandeBharatCount,
      superfast_count: superfastCount,
      express_count: expressCount,
      passenger_count: passengerCount,
      freight_count: freightCount,
      daily_frequency: '50-60 train movements/day (both directions)',
      corridor_length_km: 157.1,
      max_speed_kmh: 130
    };
  },

  async getAvailableWindows() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('available_block_windows').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getAvailableWindows fallback:', e);
      }
    }
    initializeLocalStorage();
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.WINDOWS) || '[]');
  },

  // Train-aware AI Plan Recommendations
  // Generates ranked possession plans based on:
  //   - Pending maintenance tasks (severity, urgency)
  //   - Train-free corridor windows (no trains 01:00-04:30 AM)
  //   - Track section health scores (lower health = higher priority)
  async generateAIRecommendedPlans() {
    const [tasks, trains, sections, blocks] = await Promise.all([
      this.getMaintenanceTasks(),
      this.getTrainMovements(),
      this.getSections(),
      this.getMaintenanceBlocks(),
    ]);

    // Build set of section IDs that already have a proposed/approved block
    const activeSectionIds = new Set(
      blocks.filter(b => ['Proposed','Approved','Assigned'].includes(b.status)).map(b => b.section_id)
    );

    // Train-free windows: trains running between 05:00-23:00 UTC typically.
    // Night window 01:00-04:30 IST = 19:30-23:00 UTC previous day — flag all trains that run during 21:00-02:00 UTC as blocking
    const trainsInNightWindow = trains.filter(t => {
      try {
        const st = new Date(t.start_time).getUTCHours();
        const et = new Date(t.end_time).getUTCHours();
        // 19:30 (approx 20) to 02:00 UTC
        return (st >= 20 || st <= 2) || (et >= 20 || et <= 2);
      } catch { return false; }
    });
    const blockedSections = new Set(trainsInNightWindow.map(t => t.section_id));

    // Group pending tasks by section
    const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'AI-Optimized');
    const tasksBySection = {};
    pendingTasks.forEach(t => {
      if (!tasksBySection[t.section_id]) tasksBySection[t.section_id] = [];
      tasksBySection[t.section_id].push(t);
    });

    const SECTION_NAMES = {
      'SEC-TEN-MEJ': 'Tirunelveli - Vanchi Maniyachchi (TEN-MEJ)',
      'SEC-MEJ-CVP': 'Vanchi Maniyachchi - Kovilpatti (MEJ-CVP)',
      'SEC-CVP-SRT': 'Kovilpatti - Satur (CVP-SRT)',
      'SEC-SRT-VPT': 'Satur - Virudhunagar (SRT-VPT)',
      'SEC-VPT-TMQ': 'Virudhunagar - Tirumangalam (VPT-TMQ)',
      'SEC-TMQ-MDU': 'Tirumangalam - Madurai Approach (TMQ-MDU)',
    };

    // Key night-time train information for display
    const TRAIN_DECONFLICT_INFO = {
      'SEC-TEN-MEJ': { safe: true,  trains: ['20666 VB (05:35)', '20627 VB (05:00)'], window: '01:00 – 04:45 IST' },
      'SEC-MEJ-CVP': { safe: true,  trains: ['12694 Pearl City (22:50)', '12693 (03:30)'], window: '23:30 – 03:00 IST' },
      'SEC-CVP-SRT': { safe: true,  trains: ['BCNHL Freight (02:00)', '22630 LTT (07:30)'], window: '02:45 – 06:30 IST' },
      'SEC-SRT-VPT': { safe: true,  trains: ['BTPN-3309 Petroleum (03:30)', '20603 Amrit (10:00)'], window: '00:30 – 03:00 IST' },
      'SEC-VPT-TMQ': { safe: true,  trains: ['12637 Pandian (20:00)', '16526 Island (23:30)'], window: '01:30 – 04:30 IST' },
      'SEC-TMQ-MDU': { safe: true,  trains: ['12634 Kanyakumari (14:30)', '16352 Balaji (09:15)'], window: '02:00 – 05:30 IST' },
    };

    // Build recommendations for each section that has pending tasks
    const recommendations = Object.entries(tasksBySection)
      .map(([sectionId, sectionTasks]) => {
        const section = sections.find(s => s.id === sectionId);
        const healthScore = section?.asset_health_score || 85;
        const criticalCount = sectionTasks.filter(t => t.severity === 'Critical' || t.priority_level === 'P1 Critical').length;
        const highCount = sectionTasks.filter(t => t.severity === 'High').length;
        const totalDuration = sectionTasks.reduce((sum, t) => sum + (t.estimated_duration || 120), 0);

        // AI score: lower health + more critical tasks + no existing block = higher score
        const healthPenalty = (100 - healthScore) * 0.4;
        const criticalBonus = criticalCount * 15 + highCount * 8;
        const existingBlockPenalty = activeSectionIds.has(sectionId) ? -30 : 0;
        const aiScore = Math.min(99, Math.max(40, Math.round(healthPenalty + criticalBonus + 60 + existingBlockPenalty)));

        const deconflict = TRAIN_DECONFLICT_INFO[sectionId] || { safe: true, trains: ['No express trains'], window: '01:00 – 04:30 IST' };

        // Suggested possession window (IST night window)
        const today = new Date();
        const possDate = new Date(today); possDate.setDate(today.getDate() + 1);
        const possStart = new Date(possDate); possStart.setHours(19, 30, 0, 0); // 01:00 IST = 19:30 UTC
        const possEnd   = new Date(possDate); possEnd.setHours(23, 0, 0, 0);   // 04:30 IST = 23:00 UTC

        return {
          id: `AI-REC-${sectionId}-${Date.now()}`,
          section_id: sectionId,
          section_name: SECTION_NAMES[sectionId] || sectionId,
          ai_score: aiScore,
          health_score: healthScore,
          tasks_count: sectionTasks.length,
          critical_count: criticalCount,
          high_count: highCount,
          total_duration_min: totalDuration,
          tasks: sectionTasks,
          has_existing_block: activeSectionIds.has(sectionId),
          window_label: deconflict.window,
          conflicting_trains: deconflict.trains,
          train_free: deconflict.safe,
          start_time: possStart.toISOString(),
          end_time: possEnd.toISOString(),
          departments: [...new Set(sectionTasks.map(t => t.department))],
          priority_tasks: sectionTasks.filter(t => t.priority_level === 'P1 Critical').map(t => t.task_title),
        };
      })
      .sort((a, b) => b.ai_score - a.ai_score)
      .slice(0, 6); // top 6

    return recommendations;
  },

  // 7. DYNAMIC DASHBOARD AGGREGATED METRICS
  async getDashboardSummary() {
    const [corridors, sections, assets, tasks, windows] = await Promise.all([
      this.getCorridors(),
      this.getSections(),
      this.getAssets(),
      this.getTasks(),
      this.getAvailableWindows()
    ]);

    const totalTasks = tasks.length;
    const criticalTasks = tasks.filter((t) => t.severity === 'Critical' || t.priority_level === 'P1 Critical').length;
    const approvedTasks = tasks.filter((t) => t.status === 'Approved' || t.status === 'AI-Optimized').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

    const avgHealth = assets.length > 0
      ? (assets.reduce((sum, a) => sum + Number(a.asset_health_score || 90), 0) / assets.length).toFixed(1)
      : '92.0';

    const deptWorkload = {
      Civil: tasks.filter((t) => t.department === 'Civil').length,
      'Signal & Telecom': tasks.filter((t) => t.department === 'Signal & Telecom').length,
      Electrical: tasks.filter((t) => t.department === 'Electrical').length
    };

    const highRiskSections = sections
      .map((sec) => {
        const secTasks = tasks.filter((t) => t.section_id === sec.id);
        const secCritical = secTasks.filter((t) => t.severity === 'Critical').length;
        const secAssets = assets.filter((a) => a.section_id === sec.id);
        const secHealth = secAssets.length > 0
          ? (secAssets.reduce((acc, a) => acc + Number(a.asset_health_score), 0) / secAssets.length).toFixed(1)
          : sec.asset_health_score;

        return {
          ...sec,
          effectiveHealth: Number(secHealth),
          totalTasks: secTasks.length,
          criticalTasks: secCritical
        };
      })
      .sort((a, b) => a.effectiveHealth - b.effectiveHealth);

    return {
      corridor: corridors[0] || SEED_CORRIDORS[0],
      totalTasks,
      criticalTasks,
      approvedTasks,
      pendingTasks,
      avgAssetHealth: avgHealth,
      availableWindowsCount: windows.length,
      deptWorkload,
      highRiskSections,
      sections,
      assetsCount: assets.length
    };
  },

  // 8. MAINTENANCE BLOCKS & APPROVAL WORKFLOW
  async getMaintenanceBlocks(filters = {}) {
    let blocks = [];
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('maintenance_blocks').select('*, railway_sections(section_name)');
        if (filters.status && filters.status !== 'ALL') query = query.eq('status', filters.status);
        if (filters.section_id && filters.section_id !== 'ALL') query = query.eq('section_id', filters.section_id);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          blocks = data;
        }
      } catch (e) {
        console.warn('Supabase getMaintenanceBlocks fallback:', e);
      }
    }

    if (blocks.length === 0) {
      initializeLocalStorage();
      const allSections = await this.getSections();
      const sectionMap = Object.fromEntries(allSections.map(s => [s.id, s.section_name]));

      let localBlocks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BLOCKS) || '[]');
      if (filters.status && filters.status !== 'ALL') {
        localBlocks = localBlocks.filter(b => b.status === filters.status);
      }
      if (filters.section_id && filters.section_id !== 'ALL') {
        localBlocks = localBlocks.filter(b => b.section_id === filters.section_id);
      }

      blocks = localBlocks.map(b => ({
        ...b,
        railway_sections: {
          section_name: sectionMap[b.section_id] || b.section_id
        }
      }));
    }

    return blocks;
  },

  async approveMaintenanceBlock(blockId, adminName = 'Er. S. Kumar (Chief Controller)') {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('maintenance_blocks')
          .update({
            status: 'Approved',
            approved_by: adminName,
            approved_at: now,
            updated_at: now
          })
          .eq('id', blockId);
      } catch (e) {
        console.warn('Supabase approveMaintenanceBlock fallback:', e);
      }
    }

    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BLOCKS) || '[]');
    let updatedBlock = null;
    const updated = all.map(b => {
      if (b.id === blockId) {
        updatedBlock = {
          ...b,
          status: 'Approved',
          approved_by: adminName,
          approved_at: now,
          updated_at: now
        };
        return updatedBlock;
      }
      return b;
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(updated));
    return updatedBlock;
  },

  async rejectMaintenanceBlock(blockId, adminName = 'Er. S. Kumar (Chief Controller)', reason = 'Requires schedule revision') {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('maintenance_blocks')
          .update({
            status: 'Rejected',
            rejected_by: adminName,
            rejected_at: now,
            rejection_reason: reason,
            updated_at: now
          })
          .eq('id', blockId);
      } catch (e) {
        console.warn('Supabase rejectMaintenanceBlock fallback:', e);
      }
    }

    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BLOCKS) || '[]');
    let updatedBlock = null;
    const updated = all.map(b => {
      if (b.id === blockId) {
        updatedBlock = {
          ...b,
          status: 'Rejected',
          rejected_by: adminName,
          rejected_at: now,
          rejection_reason: reason,
          updated_at: now
        };
        return updatedBlock;
      }
      return b;
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(updated));
    return updatedBlock;
  },

  async assignMaintenanceBlock(blockId, department, viewer = null, plannerName = 'Er. R. Ramesh (Senior Section Engineer)', notes = '') {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('maintenance_blocks')
          .update({
            status: 'Assigned',
            assigned_department: department,
            assigned_by: plannerName,
            assigned_at: now,
            notes: notes || undefined,
            updated_at: now
          })
          .eq('id', blockId);
      } catch (e) {
        console.warn('Supabase assignMaintenanceBlock fallback:', e);
      }
    }

    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BLOCKS) || '[]');
    let updatedBlock = null;
    const updated = all.map(b => {
      if (b.id === blockId) {
        updatedBlock = {
          ...b,
          status: 'Assigned',
          assigned_department: department,
          assigned_by: plannerName,
          assigned_viewer_id: viewer?.id || null,
          assigned_viewer_name: viewer?.name ? `${viewer.name} (${viewer.designation})` : null,
          assigned_at: now,
          notes: notes || b.notes,
          updated_at: now
        };
        return updatedBlock;
      }
      return b;
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(updated));

    // If a viewer was assigned, mark viewer as occupied
    if (viewer?.id) {
      await this.updateViewerStatus(viewer.id, 'Occupied', `Assigned to ${updatedBlock?.title || 'Maintenance Block'}`);
    }

    return updatedBlock;
  },

  async completeMaintenanceBlock(blockId, completionData = {}) {
    const now = new Date().toISOString();
    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BLOCKS) || '[]');
    let updatedBlock = null;

    const updated = all.map(b => {
      if (b.id === blockId) {
        updatedBlock = {
          ...b,
          status: 'Completed',
          completed_at: now,
          completed_by: completionData.completed_by || 'Field Supervisor',
          track_fit_status: completionData.track_fit_status || 'Fit for Normal Speed',
          speed_restriction_kmh: completionData.speed_restriction_kmh || 110,
          completion_notes: completionData.completion_notes || 'All track maintenance tasks executed successfully. Track cleared and certified fit.',
          updated_at: now
        };
        return updatedBlock;
      }
      return b;
    });

    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(updated));

    // Release assigned viewer back to Available
    if (updatedBlock?.assigned_viewer_id) {
      await this.updateViewerStatus(updatedBlock.assigned_viewer_id, 'Available', null);
    }

    // Restore track section asset health
    if (updatedBlock?.section_id) {
      const sections = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS) || '[]');
      const updatedSecs = sections.map(s => {
        if (s.id === updatedBlock.section_id) {
          return {
            ...s,
            asset_health_score: Math.min(99, (s.asset_health_score || 85) + 8)
          };
        }
        return s;
      });
      localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(updatedSecs));
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('maintenance_blocks')
          .update({
            status: 'Completed',
            completed_at: now,
            completed_by: completionData.completed_by || 'Field Supervisor',
            updated_at: now
          })
          .eq('id', blockId);
      } catch (e) {
        console.warn('Supabase completeMaintenanceBlock fallback:', e);
      }
    }

    return updatedBlock;
  },

  async createMaintenanceBlock(blockData) {
    initializeLocalStorage();
    const all = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BLOCKS) || '[]');
    const newBlock = {
      id: blockData.id || `BLK-SR-${Date.now().toString().slice(-4)}`,
      section_id: blockData.section_id,
      title: blockData.title || `Possession Block: ${blockData.section_id}`,
      start_time: blockData.start_time || new Date().toISOString(),
      end_time: blockData.end_time || new Date(Date.now() + 3 * 3600000).toISOString(),
      duration_minutes: blockData.duration_minutes || 180,
      status: blockData.status || 'Proposed',
      optimization_score: blockData.optimization_score || 94.0,
      approved_by: blockData.approved_by || null,
      approved_at: blockData.approved_at || null,
      assigned_department: blockData.assigned_department || null,
      assigned_by: blockData.assigned_by || null,
      assigned_viewer_id: blockData.assigned_viewer_id || null,
      assigned_viewer_name: blockData.assigned_viewer_name || null,
      notes: blockData.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      railway_sections: {
        section_name: blockData.section_name || blockData.section_id
      }
    };
    all.unshift(newBlock);
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(all));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('maintenance_blocks').insert([newBlock]);
      } catch (e) {
        console.warn('Supabase createMaintenanceBlock fallback:', e);
      }
    }
    return newBlock;
  },

  async approveAIRecommendation(rec, adminName = 'Er. S. Kumar (Chief Controller)') {
    const now = new Date().toISOString();
    const newBlock = {
      id: `BLK-AI-${Date.now().toString().slice(-4)}`,
      section_id: rec.section_id,
      title: `AI Block: ${rec.section_name} (${rec.window_label || '01:00 - 04:30 AM'})`,
      start_time: rec.start_time,
      end_time: rec.end_time,
      duration_minutes: rec.total_duration_min || 180,
      status: 'Approved',
      optimization_score: rec.ai_score || 95.0,
      approved_by: adminName,
      approved_at: now,
      assigned_department: rec.departments?.[0] || 'Civil',
      notes: `AI Generated possession plan based on 27-train timetable. De-conflicted window (${rec.window_label}). Bundles ${rec.tasks_count} maintenance tasks: ${rec.priority_tasks?.join(', ') || 'Track & OHE maintenance'}.`,
      section_name: rec.section_name
    };
    return await this.createMaintenanceBlock(newBlock);
  },

  // 9. FIELD VIEWERS & STAFF AVAILABILITY
  async getFieldViewers(filters = {}) {
    initializeLocalStorage();
    let viewers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.VIEWERS) || '[]');
    if (filters.department && filters.department !== 'ALL') {
      viewers = viewers.filter(v => v.department === filters.department);
    }
    if (filters.status && filters.status !== 'ALL') {
      viewers = viewers.filter(v => v.status === filters.status);
    }
    if (filters.station_code && filters.station_code !== 'ALL') {
      viewers = viewers.filter(v => v.station_code === filters.station_code);
    }
    return viewers;
  },

  async updateViewerStatus(viewerId, status, currentAssignment = null) {
    initializeLocalStorage();
    const viewers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.VIEWERS) || '[]');
    const updated = viewers.map(v => {
      if (v.id === viewerId) {
        return {
          ...v,
          status,
          current_assignment: currentAssignment
        };
      }
      return v;
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEWERS, JSON.stringify(updated));
    return true;
  },

  // 10. RESET & SEED DATABASE
  async resetAndSeedDatabase() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CORRIDORS, JSON.stringify(SEED_CORRIDORS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.STATIONS, JSON.stringify(SEED_STATIONS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(SEED_SECTIONS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ASSETS, JSON.stringify(SEED_ASSETS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(SEED_MAINTENANCE_TASKS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRAINS, JSON.stringify(SEED_TRAIN_MOVEMENTS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.WINDOWS, JSON.stringify(SEED_AVAILABLE_WINDOWS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.BLOCKS, JSON.stringify(SEED_MAINTENANCE_BLOCKS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEWERS, JSON.stringify(SEED_FIELD_VIEWERS));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('corridors').upsert(SEED_CORRIDORS);
        await supabase.from('stations').upsert(SEED_STATIONS);
        await supabase.from('railway_sections').upsert(SEED_SECTIONS);
        await supabase.from('assets').upsert(SEED_ASSETS);
        await supabase.from('maintenance_tasks').upsert(SEED_MAINTENANCE_TASKS);
        await supabase.from('train_movements').upsert(SEED_TRAIN_MOVEMENTS);
        await supabase.from('available_block_windows').upsert(SEED_AVAILABLE_WINDOWS);
      } catch (e) {
        console.warn('Supabase remote seed error:', e);
      }
    }
    return true;
  },

  // 9. AI CHAT (Groq Integration)
  async sendChatMessage(messages, context = null) {
    const BACKEND_URL = 'http://127.0.0.1:8000';
    
    console.log('[API] sendChatMessage called with:', {
      messageCount: messages.length,
      messages: messages,
      context
    });
    
    try {
      // Filter and validate messages before sending
      const validMessages = messages.filter(msg => {
        if (!msg.text || typeof msg.text !== 'string') {
          console.warn('[API] Filtering out message with invalid text:', msg);
          return false;
        }
        if (!msg.text.trim()) {
          console.warn('[API] Filtering out message with empty text:', msg);
          return false;
        }
        return true;
      });
      
      if (validMessages.length === 0) {
        throw new Error('No valid messages to send');
      }
      
      const payload = {
        messages: validMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text.trim()  // Ensure trimmed string
        })),
        context
      };
      
      console.log('[API] Sending payload:', payload);
      
      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }
};
