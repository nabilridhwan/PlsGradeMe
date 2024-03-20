import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { Module } from '@utils/gpaCalculator';
import GPAData from '@utils/GPAData';

interface GPAContextInterface {
  school: string | null;
  currentGPA: number | null;
  currentCredits: number | null;
  modules: Module[];

  targetGPA: number | null;
  targetCredits: number | null;

  setSchool: (school: string | null) => void;
  setCurrentGPA: (gpa: number | null) => void;
  setCurrentCredits: (credits: number | null) => void;
  setTargetGPA: (gpa: number | null) => void;
  setTargetCredits: (credits: number | null) => void;

  addModule: (module: Module) => void;
  editModule: (index: number, module: Module) => void;
  removeModule: (index: number) => void;
}

type Schools = (typeof GPAData)[number]['school'];
export type School = (typeof GPAData)[number];

export const GPAContext = createContext<GPAContextInterface | null>(null);

export const useGPAContext = () => {
  const items = useContext(GPAContext);
  if (!items) {
    throw new Error('useGPAContext must be used within a GPAContextProvider');
  }

  return items;
};

/**
 * GPA Context Provider stores logic of the application and also some helper functions for the states
 * @param children
 * @constructor
 */
export const GPAContextProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  // Used for CGPA calculation
  const [school, _setSchool] = useState<string | null>(null);
  const [currentGPA, setCurrentGPA] = useState<number | null>(null);
  const [currentCredits, setCurrentCredits] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  // Extra states for calculating target GPA
  const [targetGPA, setTargetGPA] = useState<number | null>(null);
  const [targetCredits, setTargetCredits] = useState<number | null>(null);

  /**
   * Set the school state
   * The reason for this is to reset the modules when the school is changed
   * This is because different schools have different grading systems
   * @param name
   */
  const setSchool = (name: string | null) => {
    if (!name) return;

    _setSchool(name);
    setModules([]);
  };

  const addModule = (module: Module) => {
    setModules((prev) => {
      return [...prev, { ...module }];
    });
  };

  const removeModule = (index: number) => {
    setModules((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const editModule = (index: number, module: Module) => {
    setModules((prev) => {
      return prev.map((m, i) => {
        if (i === index) {
          return module;
        }
        return m;
      });
    });
  };

  // console.log('[DEBUG - GPACONTEXTPROVIDER] school', school);
  // console.log('[DEBUG - GPACONTEXTPROVIDER] currentGPA', currentGPA);
  // console.log('[DEBUG - GPACONTEXTPROVIDER] currentCredits', currentCredits);
  // console.log('[DEBUG - GPACONTEXTPROVIDER] modules', modules);

  return (
    <GPAContext.Provider
      value={{
        school,
        currentGPA,
        currentCredits,
        setSchool,
        setTargetGPA,
        setTargetCredits,
        setCurrentGPA,
        setCurrentCredits,
        modules,
        addModule,
        editModule,
        removeModule,
        targetGPA,
        targetCredits,
      }}
    >
      {children}
    </GPAContext.Provider>
  );
};
