#include "LineStrip.h"

LineStrip::LineStrip()
{
}

LineStrip::LineStrip(const LineStrip& lineStrip)
{
	for(Point* point : lineStrip.getPoints())
	{
		this->addPoint(new Point(*point));
	}
}

void LineStrip::addPoint(Point* newPoint)
{
	_points.push_back(newPoint);
}

LineStrip::~LineStrip()
{
}
