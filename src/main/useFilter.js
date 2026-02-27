import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export default (
  keyword,
  filter,
  filterSort,
  filterMap,
  positionsInput,
  setFilteredDevices,
  setFilteredPositions,
) => {

  // 🔒 Blindaje TOTAL de groups
  const rawGroups = useSelector((state) => state.groups?.items);
  const groups = Array.isArray(rawGroups)
    ? Object.fromEntries(rawGroups.map((g) => [g.id, g]))
    : rawGroups || {};

  // 🔒 Blindaje TOTAL de devices
  const rawDevices = useSelector((state) => state.devices?.items);
  const devicesArray = Array.isArray(rawDevices)
    ? rawDevices
    : rawDevices
      ? Object.values(rawDevices)
      : [];

  // 🔒 Blindaje TOTAL de positions
  const positionsArray = Array.isArray(positionsInput)
    ? positionsInput
    : positionsInput
      ? Object.values(positionsInput)
      : [];

  const positionsMap = Array.isArray(positionsInput)
    ? Object.fromEntries(positionsInput.map((p) => [p.deviceId, p]))
    : positionsInput || {};

  useEffect(() => {

    const deviceGroups = (device) => {
      const groupIds = [];
      let groupId = device?.groupId;

      while (groupId && groups[groupId]) {
        groupIds.push(groupId);
        groupId = groups[groupId]?.groupId || 0;
      }

      return groupIds;
    };

    const lowerCaseKeyword = keyword?.toLowerCase?.() || '';

    const filtered = devicesArray
      .filter(
        (device) =>
          !filter?.statuses?.length ||
          filter.statuses.includes(device?.status)
      )
      .filter(
        (device) =>
          !filter?.groups?.length ||
          deviceGroups(device).some((id) =>
            filter.groups.includes(id)
          )
      )
      .filter((device) =>
        [device?.name, device?.uniqueId, device?.phone, device?.model, device?.contact]
          .some((s) => s && s.toLowerCase().includes(lowerCaseKeyword))
      );

    switch (filterSort) {
      case 'name':
        filtered.sort((a, b) =>
          (a?.name || '').localeCompare(b?.name || '')
        );
        break;

      case 'lastUpdate':
        filtered.sort((a, b) => {
          const time1 = a?.lastUpdate ? dayjs(a.lastUpdate).valueOf() : 0;
          const time2 = b?.lastUpdate ? dayjs(b.lastUpdate).valueOf() : 0;
          return time2 - time1;
        });
        break;

      default:
        break;
    }

    setFilteredDevices(filtered);

    setFilteredPositions(
      filterMap
        ? filtered
            .map((device) => positionsMap[device?.id])
            .filter(Boolean)
        : positionsArray
    );

  }, [
    keyword,
    filter,
    filterSort,
    filterMap,
    groups,
    devicesArray,
    positionsArray,
    positionsMap,
    setFilteredDevices,
    setFilteredPositions,
  ]);
};
