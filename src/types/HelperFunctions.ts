import { TFile } from "obsidian";

export interface DataJson {
	[path: string]: any;
}

export interface HelperFunctions {
	writeToDataJson: (data: DataJson) => void;
	readFromDataJson: () => Promise<DataJson>;
	getCurrentOpenFile: () => TFile;
	modifyFile: (file: TFile, content: string) => Promise<void>;
}
