#pragma once
#include <vector>

#include "Point.h"

class LineStrip
{
private:
	std::vector<Point*> _points;

public:
	LineStrip();
	LineStrip(const LineStrip& lineStrip);

	void addPoint(Point* newPoint);
	std::vector<Point*> getPoints() const { return _points; }
	void setPoints(std::vector<Point*> val) { _points = val; }

	~LineStrip();
};