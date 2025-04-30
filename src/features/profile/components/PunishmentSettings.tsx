import React, { useState } from 'react';
import {
  usePunishmentTypes,
  useUpdatePunishmentTypeValue,
  useAddPunishmentType,
  usePunishmentThresholds
} from '../services/SocialScoreService';
import { Id } from '../../../../convex/_generated/dataModel';

interface PunishmentSettingsProps {
  isAdmin: boolean;
}

const PunishmentSettings: React.FC<PunishmentSettingsProps> = ({ isAdmin }) => {
  const punishmentTypes = usePunishmentTypes();
  const thresholds = usePunishmentThresholds();
  const updatePunishmentValue = useUpdatePunishmentTypeValue();
  const addPunishmentType = useAddPunishmentType();

  const [newPunishment, setNewPunishment] = useState({
    name: '',
    description: '',
    pointValue: 10
  });

  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [showThresholds, setShowThresholds] = useState(false);

  // Handle changing a punishment's point value
  const handleValueChange = (id: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setEditValues({ ...editValues, [id]: numValue });
    }
  };

  // Handle saving a punishment's point value
  const handleSave = async (id: string) => {
    const value = editValues[id];
    if (value !== undefined) {
      await updatePunishmentValue({
        punishmentTypeId: id as unknown as Id<"punishmentTypes">,
        newPointValue: value
      });
      setIsEditing({ ...isEditing, [id]: false });
    }
  };

  // Handle adding a new punishment type
  const handleAddPunishment = async () => {
    if (newPunishment.name && newPunishment.description) {
      await addPunishmentType({
        name: newPunishment.name,
        description: newPunishment.description,
        pointValue: newPunishment.pointValue
      });
      
      // Reset the form
      setNewPunishment({
        name: '',
        description: '',
        pointValue: 10
      });
      setIsAdding(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="punishment-settings">
      <h2>Punishment Settings</h2>
      <p>Adjust the point values for different types of punishments.</p>
      
      <div className="punishment-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Point Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {punishmentTypes?.map(punishment => (
              <tr key={punishment._id}>
                <td>{punishment.name}</td>
                <td>{punishment.description}</td>
                <td>
                  {isEditing[punishment._id] ? (
                    <input
                      type="number"
                      value={editValues[punishment._id] ?? punishment.pointValue}
                      onChange={(e) => handleValueChange(punishment._id, e.target.value)}
                      min="0"
                      max="10000"
                    />
                  ) : (
                    punishment.pointValue
                  )}
                </td>
                <td>
                  {isEditing[punishment._id] ? (
                    <button onClick={() => handleSave(punishment._id)}>
                      Save
                    </button>
                  ) : (
                    <button onClick={() => {
                      setIsEditing({ ...isEditing, [punishment._id]: true });
                      setEditValues({ ...editValues, [punishment._id]: punishment.pointValue });
                    }}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding ? (
        <div className="add-punishment">
          <h3>Add New Punishment Type</h3>
          <div>
            <label>
              Name:
              <input
                type="text"
                value={newPunishment.name}
                onChange={(e) => setNewPunishment({ ...newPunishment, name: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <input
                type="text"
                value={newPunishment.description}
                onChange={(e) => setNewPunishment({ ...newPunishment, description: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              Point Value:
              <input
                type="number"
                value={newPunishment.pointValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setNewPunishment({ ...newPunishment, pointValue: value });
                  }
                }}
                min="0"
                max="10000"
              />
            </label>
          </div>
          <div className="actions">
            <button onClick={handleAddPunishment}>Add</button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="action-buttons" style={{ marginTop: '20px' }}>
          <button onClick={() => setIsAdding(true)}>Add New Punishment Type</button>
          <button 
            onClick={() => setShowThresholds(!showThresholds)}
            style={{ marginLeft: '10px' }}
          >
            {showThresholds ? 'Hide Thresholds' : 'Show Thresholds'}
          </button>
        </div>
      )}

      {showThresholds && thresholds && (
        <div className="thresholds-info" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Anti-Abuse Thresholds</h3>
          <p>These settings limit how many punishments of each type can affect a user's social score in a given time period.</p>
          
          <table style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Punishment Type</th>
                <th>Daily Limit</th>
                <th>Weekly Limit</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(thresholds).map(([type, limits]) => (
                <tr key={type}>
                  <td>{type === 'default' ? 'Default (for new types)' : type}</td>
                  <td>{limits.daily}</td>
                  <td>{limits.weekly}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <p style={{ marginTop: '10px', fontSize: '0.9em', fontStyle: 'italic' }}>
            Example: If a user receives 5 bans in one day, only the first {thresholds.ban?.daily || '?'} will count against their social score.
          </p>
        </div>
      )}

      <div className="info-box">
        <h3>How Social Scores Work</h3>
        <p>
          When a punishment is applied to a user, their social score is reduced by the point value.
          If the point value of a punishment type is changed, all users with that punishment will
          have their social scores automatically recalculated.
        </p>
        <p>
          Example: If a user has two bans worth 50 points each, their social score would be 9900.
          If the ban value is changed to 25 points, their score would automatically update to 9950.
        </p>
        <p>
          <strong>Anti-Abuse Protection:</strong> To prevent mass ban attacks, only a limited number of each punishment type
          within a time period will count against a user's social score. For example, only the first {thresholds?.ban?.daily || 2} bans 
          per day and first {thresholds?.ban?.weekly || 5} bans per week will affect the score.
        </p>
      </div>
    </div>
  );
};

export default PunishmentSettings; 