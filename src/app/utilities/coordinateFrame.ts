import { Matrix4, Vector3, Vector4 } from "three";

export class CoordinateFrame {
    private e1: Vector3;
    private e2: Vector3;
    private e3: Vector3;
    private origin: Vector3;

    private matrix: Matrix4;

    constructor(e1: Vector3, e2: Vector3, e3: Vector3, origin: Vector3) {
        this.e1 = e1.clone();
        this.e2 = e2.clone();
        this.e3 = e3.clone();
        this.origin = origin.clone();

		this.matrix = new Matrix4();
		this.set(e1, e2, e3, origin);
    }

    public get E1(): Vector3 {
        return this.e1.clone();
    }

    public get E2(): Vector3 {
        return this.e2.clone();
    }

    public get E3(): Vector3 {
        return this.e3.clone();
    }
    
    public get Origin(): Vector3 {
        return this.origin.clone();
    }

    public get Matrix(): Matrix4 {
        return this.matrix.clone();
    }
	
	public set(e1: Vector3 | Vector4, e2: Vector3 | Vector4, e3: Vector3 | Vector4, origin: Vector3 | Vector4): void {
		this.e1.set(e1.x, e1.y, e1.z);
		this.e2.set(e2.x, e2.y, e2.z);
		this.e3.set(e3.x, e3.y, e3.z);
		this.origin.set(origin.x, origin.y, origin.z);

		this.matrix.set(e1.x, e2.x, e3.x, origin.x, e1.y, e2.y, e3.y, origin.y, e1.z, e2.z, e3.z, origin.z, 0, 0, 0, 1);
		//this.mat.transpose();
	}

    public transformToOtherFrame(otherFrame: CoordinateFrame): Matrix4 {
        const res = new Matrix4();
        const otherMat = otherFrame.Matrix.clone();
        res.multiplyMatrices(otherMat.invert(), this.matrix);
        return res;
    }
}
